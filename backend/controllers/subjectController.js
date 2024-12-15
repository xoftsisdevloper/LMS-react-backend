// controllers/subjectController.js
import Subject from '../models/subjectModel.js';

// Get all subjects
export const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().populate('materials');
    res.status(200).json(subjects); // Return subjects with a 200 status
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching subjects', details: error.message });
  }
};

// Create a subject
export const createSubject = async (req, res) => {
  try {
    const newSubject = new Subject(req.body);
    await newSubject.save();
    res.status(201).json({ message: 'Subject created successfully', subject: newSubject });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Error creating subject', details: error.message });
  }
};

// Update a subject
export const updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }
    res.status(200).json({ message: 'Subject updated successfully', subject });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Error updating subject', details: error.message });
  }
};

// Delete a subject
export const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }
    res.status(204).send(); // No content to send back
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting subject', details: error.message });
  }
};
