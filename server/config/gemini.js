import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is required in environment variables');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Configuration for different models
export const models = {
  generate: genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash-001",
    generationConfig: {
      temperature: 0.7,
      topP: 0.8,
      topK: 40,
      maxOutputTokens: 8192,
    }
  }),
  enhance: genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash-001",
    generationConfig: {
      temperature: 0.5,
      topP: 0.9,
      topK: 40,
      maxOutputTokens: 2048,
    }
  }),
  edit: genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash-001",
    generationConfig: {
      temperature: 0.6,
      topP: 0.8,
      topK: 40,
      maxOutputTokens: 8192,
    }
  }),
};

export default genAI;