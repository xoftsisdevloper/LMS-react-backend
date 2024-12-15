import express from 'express';
import { getAllMaterials, createMaterial, updateMaterial, deleteMaterial, getMaterialsForSubject, getMaterialsById } from '../controllers/materialController.js';

const router = express.Router();

// GET all materials
router.get('/', getAllMaterials);

// POST create a material
router.post('/', createMaterial);

// PUT update a material
router.put('/:id', updateMaterial);

// DELETE a material
router.delete('/:id', deleteMaterial);

// Get materials for a specific subject
router.get('/:id/materials', getMaterialsForSubject)

// Get material by id
router.get('/:id/', getMaterialsById)

export default router;
