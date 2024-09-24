import Material from "../models/meterialModel.js"

// Create a new material
export const createMaterial = async (req, res) => {
    
    try {
      const { title, content, accessibleByGroups } = req.body
      
    // Check if all group IDs are valid (optional validation)
    if (accessibleByGroups && accessibleByGroups.length > 0) {
      const groups = await Group.find({ _id: { $in: accessibleByGroups } })
      if (groups.length !== accessibleByGroups.length) {
        return res.status(400).json({ message: 'Some groups do not exist' })
      }
    }

    // Create a new material
    const material = new Material({
      title,
      content,
      accessibleByGroups,
    })

    await material.save()
    res.status(201).json({ message: 'Material created successfully', material })
  } catch (error) {
    res.status(500).json({ message: 'Error creating material', error })
  }
}

// Fetch all materials with their associated groups
export const allMaterials = async (req, res) =>{
    try {
        const materials = await Material.find().populate('accessibleByGroups')
        res.status(200).json(materials)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

// Fetch a single material with its associated groups
export const fetchMaterials = async(req, res) => {
    try {
        const material = await Material.findById(req.params.id).populate('accessibleByGroups')
        if (!material) return res.status(404).json({ message: 'Material not found' })
        res.status(200).json(material)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Update a material by ID
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