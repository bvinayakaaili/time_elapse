import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Merge, Upload, Download, X, Wand2 } from 'lucide-react';

interface BlendedImage {
  url: string;
  instruction: string;
  description: string;
  sourceCount: number;
  timestamp: string;
}

interface ImageFile {
  file: File;
  preview: string;
  id: string;
}

const BlendTab: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<ImageFile[]>([]);
  const [instruction, setInstruction] = useState('');
  const [isBlending, setIsBlending] = useState(false);
  const [blendedImage, setBlendedImage] = useState<BlendedImage | null>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (selectedFiles.length + files.length > 3) {
      toast({
        title: "Too many images",
        description: "Maximum 3 images allowed for blending.",
        variant: "destructive",
      });
      return;
    }

    files.forEach((file) => {
      if (file.size > 15 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} is larger than 15MB.`,
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage: ImageFile = {
          file,
          preview: e.target?.result as string,
          id: `${Date.now()}-${Math.random()}`,
        };
        setSelectedFiles((prev) => [...prev, newImage]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (id: string) => {
    setSelectedFiles((prev) => prev.filter((img) => img.id !== id));
  };

  const handleBlend = async () => {
    if (selectedFiles.length < 2 || !instruction.trim()) {
      toast({
        title: "Missing requirements",
        description: "Please select at least 2 images and provide blending instructions.",
        variant: "destructive",
      });
      return;
    }

    setIsBlending(true);

    try {
      const formData = new FormData();
      selectedFiles.forEach((imageFile) => {
        formData.append('images', imageFile.file);
      });
      formData.append('instruction', instruction);

      const response = await fetch('/api/blend', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to blend images');
      }

      const result = await response.json();
      setBlendedImage({
        url: result.data.blendedImageUrl,
        instruction: result.data.instruction,
        description: result.data.blendDescription,
        sourceCount: result.data.sourceImages,
        timestamp: result.data.timestamp,
      });

      toast({
        title: "Images blended successfully!",
        description: `${selectedFiles.length} images blended into one masterpiece.`,
      });
    } catch (error) {
      console.error('Blend error:', error);
      toast({
        title: "Blend failed",
        description: "Please try again with different images or instructions.",
        variant: "destructive",
      });
    } finally {
      setIsBlending(false);
    }
  };

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="bg-white/80 backdrop-blur-sm border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Merge className="h-5 w-5 text-green-600" />
            <span>Image Blending</span>
          </CardTitle>
          <CardDescription>
            Upload 2-3 images and describe how you'd like them creatively combined
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Images ({selectedFiles.length}/3)
            </label>
            <div className="flex items-center space-x-4">
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="flex-1"
                disabled={isBlending || selectedFiles.length >= 3}
              />
              <Button
                variant="outline"
                size="sm"
                className="whitespace-nowrap"
                disabled={selectedFiles.length >= 3}
              >
                <Upload className="h-4 w-4 mr-1" />
                Browse
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              2-3 images required. Maximum file size: 15MB each. Supported formats: JPG, PNG, WebP
            </p>
          </div>

          {/* Image Previews */}
          {selectedFiles.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedFiles.map((imageFile, index) => (
                <div key={imageFile.id} className="relative">
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-2">
                    <img
                      src={imageFile.preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 h-6 w-6 p-0"
                      onClick={() => removeImage(imageFile.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-xs text-center text-gray-500 mt-1">
                    Image {index + 1}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blending Instructions
            </label>
            <Textarea
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="Combine the subjects from both images in a surreal landscape, mix the colors from image 1 with the style of image 2..."
              className="min-h-[80px] resize-none"
              disabled={isBlending}
            />
          </div>

          <Button
            onClick={handleBlend}
            disabled={isBlending || selectedFiles.length < 2 || !instruction.trim()}
            className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
          >
            {isBlending ? (
              <>
                <Wand2 className="h-4 w-4 mr-2 animate-spin" />
                Blending Images...
              </>
            ) : (
              <>
                <Merge className="h-4 w-4 mr-2" />
                Blend Images
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {blendedImage && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg">Source Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {selectedFiles.map((imageFile, index) => (
                  <img
                    key={imageFile.id}
                    src={imageFile.preview}
                    alt={`Source ${index + 1}`}
                    className="w-full h-24 object-cover rounded"
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600">
                {selectedFiles.length} source images used for blending
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
            <CardHeader>
              <CardTitle className="text-lg text-purple-700">Blended Result</CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src={blendedImage.url}
                alt="Blended"
                className="w-full rounded-lg shadow-sm mb-3"
              />
              <div className="space-y-2">
                <div className="text-sm">
                  <strong>Instruction:</strong> {blendedImage.instruction}
                </div>
                <div className="text-sm text-gray-600">
                  <strong>AI Analysis:</strong> {blendedImage.description}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleDownload(blendedImage.url, 'blended-image.jpg')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Blended Image
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default BlendTab;