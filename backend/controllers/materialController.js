// controllers/materialController.js
import Material from '../models/meterialModel.js'; // Ensure the import path is correct
import Subject from '../models/subjectModel.js';

// Get all materials
export const getAllMaterials = async (req, res) => {
  try {
    const materials = await Material.find();
    res.status(200).json(materials); // Return materials with a 200 status
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching materials', details: error.message });
  }
};

// Create a material
export const createMaterial = async (req, res) => {
  try {
    const newMaterial = new Material(req.body);
    await newMaterial.save();
    res.status(201).json({ message: 'Material created successfully', material: newMaterial });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Error creating material', details: error.message });
  }
};

// Update a material
export const updateMaterial = async (req, res) => {
  try {
      const { id } = req.params
      const { title, content, accessibleByGroups } = req.body
      
      const material = await Material.findById(id)
      if (!material) {
          return res.status(404).json({ message: 'Material not found' })
      }

      material.title = title || material.title
      material.content = content || material.content
      material.accessibleByGroups = accessibleByGroups || material.accessibleByGroups

      await material.save()
      res.status(200).json({ message: 'Material updated successfully', material })
  } catch (error) {
      res.status(500).json({ message: 'Error updating material', error })
  }
}

// Delete a material
export const deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findByIdAndDelete(req.params.id);
    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }
    res.status(204).send(); // No content to send back
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting material', details: error.message });
  }
};

// Get materials for a specific subject
export const getMaterialsForSubject = async (req, res) => {
  try {
    // Find the subject by its ID and populate the materials field
    const subject = await Subject.findById(req.params.id).populate('materials');
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    // Return the materials for the subject
    res.status(200).json({ subject, materials: subject.materials });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching materials for subject', details: error.message });
  }
};

export const getMaterialsById = async (req, res) => {
  try {
    // Find the subject by its ID and populate the materials field
    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    // Return the materials for the subject
    res.status(200).json(material);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching material', details: error.message });
  }
};
