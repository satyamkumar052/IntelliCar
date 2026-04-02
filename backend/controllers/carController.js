import Car from '../models/Car.js';
import Document from '../models/Document.js';
import Reminder from '../models/Reminder.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Get all cars for logged in user
// @route   GET /api/cars
// @access  Private
export const getCars = async (req, res) => {
  try {
    const cars = await Car.find({ user: req.user._id });
    res.json({ success: true, data: cars });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add a new car
// @route   POST /api/cars
// @access  Private
export const addCar = async (req, res) => {
  try {
    const { brand, model, year, registrationNumber, fuelType, transmission, mileage, color } = req.body;

    const carExists = await Car.findOne({ registrationNumber });
    if (carExists) {
      return res.status(400).json({ success: false, message: 'Car with this registration number already exists' });
    }

    const car = await Car.create({
      user: req.user._id,
      brand,
      model,
      year,
      registrationNumber,
      fuelType,
      transmission,
      mileage,
      color
    });

    res.status(201).json({ success: true, data: car });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a car
// @route   PUT /api/cars/:id
// @access  Private
export const updateCar = async (req, res) => {
  try {
    let car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }

    // Ensure car belongs to user
    if (car.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized to update this car' });
    }

    car = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: car });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a car
// @route   DELETE /api/cars/:id
// @access  Private
export const deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }

    if (car.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this car' });
    }

    // Cascade delete documents and physical files
    const docs = await Document.find({ car: req.params.id });
    for (const doc of docs) {
      if (doc.fileUrl && doc.fileUrl.startsWith('/uploads/')) {
        const filePath = path.join(__dirname, '..', doc.fileUrl);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    await Document.deleteMany({ car: req.params.id });
    await Reminder.deleteMany({ car: req.params.id });

    await car.deleteOne();
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
