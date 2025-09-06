# Era Whisperer 🕰️✨

A sophisticated full-stack web application that uses advanced AI to generate, edit, and blend images across different time periods. Built with cutting-edge technology and beautiful design.

![Era Whisperer](https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=400&fit=crop&crop=center&auto=format&q=80)

## ✨ Features

### 🎨 Era Image Generation
- Generate images across four distinct time periods: 1900, 1950, 2000, 2050
- Each era features authentic historical styling and aesthetics
- Interactive timeline slider to explore different eras
- AI-powered prompt enhancement (optional)

### 🖼️ Advanced Image Editing
- Upload any image and describe desired modifications
- Natural language instructions for editing
- AI-powered analysis and transformation
- Before/after comparison view

### 🎭 Creative Image Blending
- Combine 2-3 images into artistic masterpieces
- Creative fusion with custom instructions
- Intelligent composition and style mixing
- Multi-image source management

### 🎯 Additional Features
- Modern, responsive design with smooth animations
- Real-time progress tracking
- Toast notifications for user feedback
- Secure API key management
- File size validation (15MB max)
- Cross-device compatibility

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **TailwindCSS** for styling
- **shadcn/ui** components
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **ES Modules** support
- **Gemini AI** integration (@google/generative-ai)
- **Multer** for file uploads
- **CORS** enabled with security headers

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- Gemini API key from Google AI Studio

## ⚙️ Installation & Setup

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd era-whisperer

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 2. Environment Configuration

Create a `.env` file in the `server` directory:

```bash
# server/.env
GEMINI_API_KEY=your_gemini_api_key_here
ENHANCE_PROMPTS=true
NODE_ENV=development
FRONTEND_URL=http://localhost:8080
```

**Getting your Gemini API Key:**
1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Navigate to "Get API Key" section
4. Create a new API key
5. Copy the key to your `.env` file

### 3. Development Setup

```bash
# Start the backend server (runs on port 3001)
cd server
npm run dev

# In a new terminal, start the frontend (runs on port 8080)
cd ..
npm run dev
```

The application will be available at:
- **Frontend:** http://localhost:8080
- **Backend:** http://localhost:3001
- **Health Check:** http://localhost:3001/health

## 🏗️ Project Structure

```
era-whisperer/
├── server/                 # Backend application
│   ├── config/
│   │   └── gemini.js      # Gemini AI configuration
│   ├── routes/
│   │   ├── health.js      # Health check endpoint
│   │   ├── generate.js    # Era generation endpoint
│   │   ├── edit.js        # Image editing endpoint
│   │   └── blend.js       # Image blending endpoint
│   ├── utils/
│   │   └── prompts.js     # Era-specific prompt templates
│   ├── server.js          # Main Express server
│   └── package.json       # Backend dependencies
├── src/                   # Frontend application
│   ├── components/
│   │   ├── ui/            # shadcn/ui components
│   │   ├── tabs/          # Feature-specific components
│   │   ├── Header.tsx
│   │   ├── MainContent.tsx
│   │   └── ImageGallery.tsx
│   ├── hooks/             # Custom React hooks
│   ├── App.tsx            # Main React component
│   └── main.tsx           # React entry point
├── README.md              # This file
└── package.json           # Frontend dependencies
```

## 🔌 API Endpoints

### Core Endpoints
- `GET /health` - Server health check
- `POST /api/generate` - Generate era-specific images
- `POST /api/edit` - Edit uploaded images
- `POST /api/blend` - Blend multiple images

### Example Usage

#### Generate Era Images
```bash
curl -X POST http://localhost:3001/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "A person walking in a park",
    "era": "1950"
  }'
```

#### Edit Image
```bash
curl -X POST http://localhost:3001/api/edit \
  -F "image=@path/to/image.jpg" \
  -F "instruction=Add a red hat to the person"
```

## 🎨 Era Styles

### 1900s - Victorian Era
- Sepia tones and vintage photography
- Horse-drawn carriages and cobblestone streets
- Victorian fashion and architecture
- Soft lighting with historical authenticity

### 1950s - Golden Age
- Vibrant retro aesthetics
- Classic chrome cars and neon signs
- Pastel colors and mid-century modern design
- Nostalgic Americana vibes

### 2000s - Digital Age
- Early millennium technology
- Y2K culture and urban landscapes
- Flip phones and chunky computers
- Digital grain and nostalgic futurism

### 2050s - Future Vision
- Cyberpunk and sci-fi aesthetics
- Flying cars and holographic displays
- Advanced architecture and AI integration
- Neon-lit futuristic cityscapes

## 🚀 Deployment

### Frontend (Vercel)
```bash
# Build and deploy to Vercel
npm run build
npx vercel --prod
```

### Backend (Render/Railway)
```bash
# For Railway
railway login
railway new
railway add
railway deploy

# For Render
# Connect your GitHub repo at render.com
# Use the following settings:
# - Build Command: cd server && npm install
# - Start Command: cd server && npm start
```

## 🔒 Security Features

- API key secured on backend only
- Request rate limiting (100 requests per 15 minutes)
- File size validation (15MB maximum)
- CORS configuration for allowed origins
- Helmet.js security headers
- Input validation and sanitization

## 🎯 Performance Optimizations

- Image compression and optimization
- Lazy loading for large images
- Response caching where appropriate
- Efficient file handling with Multer
- Optimized bundle size with Vite

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

**API Key Error:**
- Ensure your `GEMINI_API_KEY` is correctly set in `server/.env`
- Verify the API key is active in Google AI Studio

**Port Conflicts:**
- Frontend default: 8080
- Backend default: 3001
- Change ports in `vite.config.ts` and `server/server.js` if needed

**File Upload Issues:**
- Check file size (must be < 15MB)
- Ensure image format is supported (JPG, PNG, WebP)
- Verify proper form encoding (multipart/form-data)

**CORS Errors:**
- Check `FRONTEND_URL` in server environment variables
- Ensure frontend and backend URLs match configuration

## 🎉 Acknowledgments

- Google AI for Gemini API
- shadcn/ui for beautiful components
- Unsplash for stock photography
- The open-source community

---

**Era Whisperer** - Where every moment becomes timeless ✨