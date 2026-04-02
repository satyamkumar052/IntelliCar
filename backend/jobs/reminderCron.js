import cron from 'node-cron';
import Document from '../models/Document.js';
import Reminder from '../models/Reminder.js';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';

// Run everyday at 9:00 AM AST/IST depending on server tz
const startCronJobs = () => {
  cron.schedule('0 9 * * *', async () => {
    console.log('Running daily document expiry check...');
    try {
      // Find documents expiring in 30 days or less
      const today = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(today.getDate() + 30);

      const expiringDocs = await Document.find({
        expiryDate: { $lte: thirtyDaysFromNow },
        status: { $ne: 'expired' }
      }).populate('user car');

      for (let doc of expiringDocs) {
        const daysLeft = doc.daysUntilExpiry;
        
        // Mark as expired if past due date
        if (daysLeft <= 0 && doc.status !== 'expired') {
          doc.status = 'expired';
          await doc.save();
          continue;
        }

        // Change status if expiring soon
        if (daysLeft <= 30 && doc.status === 'valid') {
          doc.status = 'expiring_soon';
          await doc.save();
        }
        
        // We trigger an email reminder and create a Reminder DB entry conditionally
        // To avoid spamming, only send email triggers on 30, 15, 7, and 1 days before expiry
        const triggerDays = [30, 15, 7, 1];
        if (triggerDays.includes(daysLeft)) {
          // Check if today's reminder for this doc already exists
          const reminderExists = await Reminder.findOne({
            document: doc._id,
            description: { $regex: `${daysLeft} days`, $options: 'i' }
          });

          if (!reminderExists) {
            // Create the in-app reminder
            const newReminder = await Reminder.create({
              user: doc.user._id,
              document: doc._id,
              car: doc.car ? doc.car._id : null,
              title: `${doc.docType} Expiry Alert`,
              description: `Your ${doc.docType} is expiring in ${daysLeft} days on ${doc.expiryDate.toDateString()}`,
              dueDate: doc.expiryDate
            });

            // Send Email
            if (doc.user.email) {
              const message = `
                <h2>IntelliCar Renewal Alert</h2>
                <p>Hello ${doc.user.name},</p>
                <p>This is a reminder that your <strong>${doc.docType}</strong> for car <strong>${doc.car ? doc.car.registrationNumber : 'Unknown'}</strong> is expiring in <strong>${daysLeft} days</strong>.</p>
                <p>Expiry Date: ${doc.expiryDate.toDateString()}</p>
                <p>Please renew your document to avoid penalties.</p>
                <p>Team IntelliCar</p>
              `;

              try {
                await sendEmail({
                  email: doc.user.email,
                  subject: `Document Expiry Alert: ${doc.docType}`,
                  message: message
                });
                newReminder.emailSent = true;
                await newReminder.save();
              } catch (err) {
                console.error('Email could not be sent', err);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Cron Job Error:', error);
    }
  });
};

export default startCronJobs;
