import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Clock, Sparkles } from 'lucide-react';

interface GeneratedImage {
  url: string;
  era: string;
  prompt: string;
  timestamp: string;
}

interface Era {
  year: number;
  label: string;
  description: string;
  color: string;
}

interface ImageGalleryProps {
  images: GeneratedImage[];
  selectedEra: string;
  eras: Era[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, selectedEra, eras }) => {
  const currentImage = images.find(img => img.era === selectedEra);
  const currentEra = eras.find(era => era.year.toString() === selectedEra);

  if (!currentImage || !currentEra) {
    return null;
  }

  const handleDownload = (url: string, era: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `era-whisperer-${era}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getEraColors = (color: string) => {
    const colorMap = {
      sepia: 'from-yellow-200 to-amber-300',
      pink: 'from-pink-200 to-rose-300',
      blue: 'from-blue-200 to-cyan-300',
      purple: 'from-purple-200 to-indigo-300',
    };
    return colorMap[color as keyof typeof colorMap] || 'from-gray-200 to-gray-300';
  };

  return (
    <div className="space-y-6">
      {/* Main Image Display */}
      <Card className={`bg-gradient-to-br ${getEraColors(currentEra.color)} backdrop-blur-sm border-2`}>
        <CardContent className="p-6">
          <div className="text-center mb-4">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Clock className="h-5 w-5 text-gray-700" />
              <h3 className="text-2xl font-bold text-gray-900">
                {currentEra.label}
              </h3>
              <Sparkles className="h-5 w-5 text-yellow-600" />
            </div>
            <p className="text-gray-700 font-medium">{currentEra.description}</p>
          </div>

          <div className="relative group">
            <img
              src={currentImage.url}
              alt={`Generated image for ${currentEra.label}`}
              className="w-full max-w-2xl mx-auto rounded-lg shadow-lg transition-transform group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg" />
          </div>

          <div className="mt-4 text-center">
            <Button
              onClick={() => handleDownload(currentImage.url, currentImage.era)}
              className="bg-white/80 hover:bg-white text-gray-800 border-2 border-gray-300"
            >
              <Download className="h-4 w-4 mr-2" />
              Download {currentEra.label}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Thumbnail Gallery */}
      <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
        <CardContent className="p-4">
          <h4 className="text-lg font-semibold text-gray-800 mb-3 text-center">
            All Eras Preview
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((image, index) => {
              const era = eras[index];
              const isSelected = image.era === selectedEra;
              return (
                <div
                  key={image.era}
                  className={`relative cursor-pointer transition-all duration-200 ${
                    isSelected 
                      ? 'ring-4 ring-purple-500 shadow-lg scale-105' 
                      : 'hover:ring-2 hover:ring-purple-300 hover:scale-102'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={`${era.label} preview`}
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg" />
                  <div className="absolute bottom-2 left-2 text-white">
                    <div className="text-sm font-semibold">{era.label}</div>
                    <div className="text-xs opacity-90">{era.description}</div>
                  </div>
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <div className="bg-purple-500 text-white rounded-full p-1">
                        <Sparkles className="h-3 w-3" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageGallery;