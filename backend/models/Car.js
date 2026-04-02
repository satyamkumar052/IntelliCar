import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    registrationNumber: {
        type: String,
        required: true,
        unique: true
    },
    fuelType: {
        type: String
    },
    transmission: { 
        type: String 
    },
    mileage: { 
        type: Number 
    },
    color: { 
        type: String 
    }
}, { timestamps: true });

// Indexing for faster queries by user
carSchema.index({ user: 1 });

const Car = mongoose.model('Car', carSchema);

export default Car;
