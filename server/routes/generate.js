import express from 'express';
import { models } from '../config/gemini.js';
import { eraPrompts, enhancePrompt } from '../utils/prompts.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { text, era } = req.body;

    if (!text || !era) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Both text and era are required'
      });
    }

    if (!eraPrompts[era]) {
      return res.status(400).json({
        error: 'Invalid era',
        message: 'Era must be one of: 1900, 1950, 2000, 2050'
      });
    }

    let finalPrompt = text;

    // Enhance prompt if enabled
    if (process.env.ENHANCE_PROMPTS === 'true') {
      try {
        const enhanceResult = await models.enhance.generateContent(enhancePrompt(text));
        const enhancedText = enhanceResult.response.text();
        if (enhancedText && enhancedText.trim()) {
          finalPrompt = enhancedText.trim();
        }
      } catch (enhanceError) {
        console.warn('Prompt enhancement failed, using original:', enhanceError.message);
      }
    }

    // Generate era-specific prompt
    const eraSpecificPrompt = eraPrompts[era](finalPrompt);

    // Generate image using Gemini
    const result = await models.generate.generateContent([eraSpecificPrompt]);
    const response = await result.response;
    
    // Note: Gemini doesn't directly generate images, so we'll return a placeholder
    // In a real implementation, you might use a different model or service for actual image generation
    const imageData = {
      url: `https://picsum.photos/512/512?random=${Date.now()}&era=${era}`,
      prompt: eraSpecificPrompt,
      era: era,
      enhanced: process.env.ENHANCE_PROMPTS === 'true',
      timestamp: new Date().toISOString()
    };

    res.json({
      success: true,
      data: imageData,
      originalPrompt: text,
      finalPrompt: finalPrompt
    });

  } catch (error) {
    console.error('Generation error:', error);
    res.status(500).json({
      error: 'Generation failed',
      message: error.message || 'Failed to generate image'
    });
  }
});

export default router;