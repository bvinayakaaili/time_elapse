export const eraPrompts = {
  1900: (userPrompt) => `Generate an image in the style of early 1900s photography depicting: "${userPrompt}". Include sepia tones, horse-drawn carriages, Victorian fashion, cobblestone streets, and vintage lampposts. Soft lighting, grainy texture, realistic historical details. Time period authenticity is critical. The scene should feel like a genuine photograph from 1900 with period-appropriate clothing, architecture, and technology.`,
  
  1950: (userPrompt) => `Generate an image in vibrant 1950s retro style depicting: "${userPrompt}". Include classic cars with chrome finishes, neon diner signs, pastel colors, and mid-century modern architecture. People wearing polka dot dresses and suits. Bright daylight, nostalgic Americana vibe. The scene should capture the optimistic post-war era with authentic 1950s fashion, cars, and cultural elements.`,
  
  2000: (userPrompt) => `Generate an image inspired by early 2000s aesthetics depicting: "${userPrompt}". Include flip phones, chunky computers, baggy jeans, CD players, and urban city streets with billboards. Slight digital grain, Y2K culture references, futuristic yet nostalgic tone. The scene should reflect the millennium era with appropriate technology, fashion, and urban design of the year 2000.`,
  
  2050: (userPrompt) => `Generate a futuristic image of the year 2050 depicting: "${userPrompt}". Include neon lights, flying cars, holographic billboards, AI-powered robots, and ultra-modern skyscrapers. Advanced fashion, glowing streets, sci-fi cyberpunk vibe, ultra-realistic lighting. The scene should be a believable vision of 2050 with advanced technology seamlessly integrated into daily life.`
};

export const enhancePrompt = (userPrompt) => `
Enhance this image generation prompt to be more detailed and visually descriptive while maintaining the core concept. Add specific details about lighting, composition, style, colors, and atmosphere that would help create a stunning image:

Original prompt: "${userPrompt}"

Enhanced prompt:`;