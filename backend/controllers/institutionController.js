// controllers/institutionController.js
import Institution from '../models/insitutionModel.js';

/**
 * Create a new institution
 */
export const createInstitution = async (req, res) => {
  try {
    const institution = new Institution(req.body);
    const savedInstitution = await institution.save();
    res.status(201).json(savedInstitution);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Get all institutions
 */
export const getAllInstitutions = async (req, res) => {
  try {
    const institutions = await Institution.find().populate('created_by institution_management_access');
    res.json({ success: true, data: institutions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Get a single institution by ID
 */
export const getInstitutionById = async (req, res) => {
  try {
    const institution = await Institution.findById(req.params.id)
      .populate([
        { path: 'created_by', select: '_id username name' },
        { path: 'institution_management_access', select: '_id username name' }
      ]);

    if (!institution) {
      return res.status(404).json({ message: 'Institution not found' });
    }

    res.json(institution);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/**
 * Update an institution
 */
export const updateInstitution = async (req, res) => {
  try {
    const updatedInstitution = await Institution.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updatedInstitution) {
      return res.status(404).json({ message: 'Institution not found' });
    }
    res.json(updatedInstitution);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Delete an institution
 */
export const deleteInstitution = async (req, res) => {
  try {
    const deletedInstitution = await Institution.findByIdAndDelete(req.params.id);
    if (!deletedInstitution) {
      return res.status(404).json({ message: 'Institution not found' });
    }
    res.json({ message: 'Institution deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get institutions managed by a specific user
 */
// controllers/institutionController.js

export const getInstitutionsForManagement = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Validate input
    if (!user_id) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    // Query institutions where userId exists in management access
    const institutions =  await Institution.find({
      institution_management_access: user_id
    }).populate([
      {
        path: 'created_by',
        select: '_id username name email',
      },
      {
        path: 'institution_management_access',
        select: '_id username name email',
      }
    ]);

    return res.status(200).json({
      success: true,
      data: institutions,
    });
  } catch (error) {
    console.error('Error fetching institutions for management access:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

