import express from 'express';
import multer from 'multer';
import { models } from '../config/gemini.js';

const router = express.Router();

// Configure multer for multiple file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB per file
    files: 3 // Maximum 3 files
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

router.post('/', upload.array('images', 3), async (req, res) => {
  try {
    const { instruction } = req.body;
    const imageFiles = req.files;

    if (!instruction) {
      return res.status(400).json({
        error: 'Missing instruction',
        message: 'Blending instruction is required'
      });
    }

    if (!imageFiles || imageFiles.length < 2) {
      return res.status(400).json({
        error: 'Insufficient images',
        message: 'At least 2 images are required for blending'
      });
    }

    if (imageFiles.length > 3) {
      return res.status(400).json({
        error: 'Too many images',
        message: 'Maximum 3 images allowed for blending'
      });
    }

    // Process images
    const processedImages = imageFiles.map((file, index) => ({
      data: file.buffer.toString('base64'),
      mimeType: file.mimetype,
      name: `Image ${index + 1}`
    }));

    // Create blending prompt
    const blendPrompt = `Analyze these ${imageFiles.length} images and create a detailed description of how they should be creatively blended according to this instruction: "${instruction}". Describe the composition, style, colors, and how elements from each image should be combined to create a cohesive final result.`;

    // Create content array with prompt and images
    const contentArray = [blendPrompt];
    processedImages.forEach(img => {
      contentArray.push({
        inlineData: {
          data: img.data,
          mimeType: img.mimeType
        }
      });
    });

    // Process with Gemini
    const result = await models.edit.generateContent(contentArray);
    const response = await result.response;
    const blendDescription = response.text();

    // For demo purposes, return a placeholder blended image
    // In production, you'd integrate with an actual image blending service
    res.json({
      success: true,
      data: {
        blendedImageUrl: `https://picsum.photos/512/512?random=${Date.now()}&blend=true`,
        blendDescription: blendDescription,
        instruction: instruction,
        sourceImages: processedImages.length,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Blend error:', error);
    res.status(500).json({
      error: 'Blend failed',
      message: error.message || 'Failed to blend images'
    });
  }
});

export default router;