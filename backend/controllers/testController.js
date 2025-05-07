import Test from "../models/testModel.js"; // Make sure you add `.js` extension if using ES modules
import mongoose from "mongoose";

// Create a new Test
export const createTest = async (req, res) => {
    try {
        console.log(req.body.data);

        const newTest = await Test.create(req.body.data);
        console.log(newTest);
        
        res.status(201).json({ success: true, data: newTest });
    } catch (error) {
        console.log(error);
        
        res.status(400).json({ success: false, message: error.message });
    }
};

// Get all Tests
export const getAllTests = async (req, res) => {
    try {
        const tests = await Test.find()
            .populate('test_subject')
            .populate('test_lesson').populate('created_by').populate('test_questions');
        res.status(200).json({ success: true, data: tests });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get a single Test by ID
export const getTestById = async (req, res) => {
    try {
        const { id } = req.params;
        const test = await Test.findById(id)
            .populate('test_subject')
            .populate('test_lesson');
        if (!test) {
            return res.status(404).json({ success: false, message: "Test not found" });
        }
        res.status(200).json({ success: true, data: test });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update a Test
export const updateTest = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedTest = await Test.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedTest) {
            return res.status(404).json({ success: false, message: "Test not found" });
        }
        res.status(200).json({ success: true, data: updatedTest });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Delete a Test
export const deleteTest = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTest = await Test.findByIdAndDelete(id);
        if (!deletedTest) {
            return res.status(404).json({ success: false, message: "Test not found" });
        }
        res.status(200).json({ success: true, message: "Test deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Tests by Type (pre-test / post-test)
export const getTestByType = async (req, res) => {
    try {
        const { type } = req.params;
        const tests = await Test.find({ test_type: type })
            .populate('test_subject')
            .populate('test_lesson');
        res.status(200).json({ success: true, data: tests });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateTestStatus = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!['enabled', 'disabled'].includes(req.body.status)) {
            return res.status(400).json({ success: false, message: "Invalid status value" });
        }

        const updatedTest = await Test.findByIdAndUpdate(id, { test_status: req.body.status }, { new: true });
        
        if (!updatedTest) {
            return res.status(404).json({ success: false, message: "Test not found" });
        }
        
        res.status(200).json({ success: true, data: updatedTest });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
