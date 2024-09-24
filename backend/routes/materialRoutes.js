import express from 'express'
import { allMaterials, createMaterial, fetchMaterials, updateMaterial } from '../controllers/materials.js';

const router = express.Router()

router.get('/', allMaterials)

router.get('/:id', fetchMaterials)

router.post('/create', createMaterial)

router.put('/update', updateMaterial)

export default router;