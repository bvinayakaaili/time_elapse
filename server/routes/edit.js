import express from 'express';
import multer from 'multer';
import { models } from '../config/gemini.js';

const router = express.Router();

// Configure multer for file upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB limit
    files: 1
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { instruction } = req.body;
    const imageFile = req.file;

    if (!instruction) {
      return res.status(400).json({
        error: 'Missing instruction',
        message: 'Editing instruction is required'
      });
    }

    if (!imageFile) {
      return res.status(400).json({
        error: 'Missing image',
        message: 'Image file is required'
      });
    }

    // Convert image to base64
    const imageBase64 = imageFile.buffer.toString('base64');
    const imageMimeType = imageFile.mimetype;

    // Create prompt for image editing
    const editPrompt = `Analyze this image and apply the following instruction: "${instruction}". Describe in detail how the image should be modified to fulfill this request, including specific changes to colors, objects, lighting, composition, or any other visual elements.`;

    // Process with Gemini (note: actual image editing would require additional image processing)
    const result = await models.edit.generateContent([
      editPrompt,
      {
        inlineData: {
          data: imageBase64,
          mimeType: imageMimeType
        }
      }
    ]);

    const response = await result.response;
    const editDescription = response.text();

    // For demo purposes, return the original image with edit description
    // In production, you'd integrate with an actual image editing service
    res.json({
      success: true,
      data: {
        editedImageUrl: `data:${imageMimeType};base64,${imageBase64}`,
        editDescription: editDescription,
        instruction: instruction,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Edit error:', error);
    res.status(500).json({
      error: 'Edit failed',
      message: error.message || 'Failed to edit image'
    });
  }
});

export default router;