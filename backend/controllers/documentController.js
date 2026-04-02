import Document from '../models/Document.js';
import Car from '../models/Car.js';
import Reminder from '../models/Reminder.js';
import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';

// @desc    Upload document and trigger OCR
// @route   POST /api/documents/:carId
// @access  Private
export const uploadDocument = async (req, res) => {
  try {
    const carId = req.params.carId;
    const car = await Car.findById(carId);

    if (!car) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(404).json({ success: false, message: 'Car not found' });
    }

    if (car.user.toString() !== req.user._id.toString()) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    // Attempt OCR from AI Microservice
    let ocrResult = null;
    try {
      // Create FormData to send file to python microservice
      const formData = new FormData();
      formData.append('file', fs.createReadStream(req.file.path), { filename: req.file.originalname });

      const aiUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
      const ocrResponse = await axios.post(`${aiUrl}/api/ocr`, formData, {
        headers: {
          ...formData.getHeaders()
        }
      });
      ocrResult = ocrResponse.data;
    } catch (ocrError) {
      console.error('OCR Error:', ocrError.message);
      // We continue even if OCR fails, user can manually input later
    }

    // Use local file path for fileUrl
    let fileUrl = `/uploads/${req.file.filename}`;

    // Create Document record
    // Use OCR data if available, otherwise defaults/body data
    let expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1); // Default +1 year if no OCR

    const docType = (ocrResult && ocrResult.docType) ? ocrResult.docType : (req.body.docType || 'Other');
    if (ocrResult && ocrResult.expiryDate) {
      expiryDate = new Date(ocrResult.expiryDate);
    }

    const document = await Document.create({
      user: req.user._id,
      car: carId,
      docType: docType,
      fileUrl: fileUrl,
      issueDate: ocrResult?.issueDate ? new Date(ocrResult.issueDate) : null,
      expiryDate: expiryDate,
      extractedText: ocrResult?.rawText || '',
      status: 'valid'
    });

    // Create reminder if expiring within 30 days
    const daysUntil = document.daysUntilExpiry;
    if (daysUntil !== null && daysUntil <= 30 && daysUntil > 0) {
      await Reminder.create({
        user: req.user._id,
        document: document._id,
        car: carId,
        title: `${docType} Renewal Due`,
        description: `Your ${docType} for ${car.registrationNumber} is expiring in ${daysUntil} days.`,
        dueDate: expiryDate
      });
      document.status = 'expiring_soon';
      await document.save();
    } else if (daysUntil !== null && daysUntil <= 0) {
      document.status = 'expired';
      await document.save();
    }

    res.status(201).json({ success: true, data: document });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get documents for a car
// @route   GET /api/documents/:carId
// @access  Private
export const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ user: req.user._id, car: req.params.carId });
    res.json({ success: true, data: documents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete document
// @route   DELETE /api/documents/:id
// @access  Private
export const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    if (document.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    await document.deleteOne();
    // Also delete associated reminders
    await Reminder.deleteMany({ document: req.params.id });

    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

