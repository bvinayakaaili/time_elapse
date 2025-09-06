import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Edit3, Upload, Download, Wand2 } from 'lucide-react';

interface EditedImage {
  url: string;
  instruction: string;
  description: string;
  timestamp: string;
}

const EditTab: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [instruction, setInstruction] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedImage, setEditedImage] = useState<EditedImage | null>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 15MB.",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!selectedFile || !instruction.trim()) {
      toast({
        title: "Missing requirements",
        description: "Please select an image and provide editing instructions.",
        variant: "destructive",
      });
      return;
    }

    setIsEditing(true);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('instruction', instruction);

      const response = await fetch('/api/edit', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to edit image');
      }

      const result = await response.json();
      setEditedImage({
        url: result.data.editedImageUrl,
        instruction: result.data.instruction,
        description: result.data.editDescription,
        timestamp: result.data.timestamp,
      });

      toast({
        title: "Image edited successfully!",
        description: "Your image has been processed with AI editing.",
      });
    } catch (error) {
      console.error('Edit error:', error);
      toast({
        title: "Edit failed",
        description: "Please try again with a different image or instruction.",
        variant: "destructive",
      });
    } finally {
      setIsEditing(false);
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
      <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Edit3 className="h-5 w-5 text-blue-600" />
            <span>Image Editing</span>
          </CardTitle>
          <CardDescription>
            Upload an image and describe how you'd like it to be modified
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Image
            </label>
            <div className="flex items-center space-x-4">
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="flex-1"
                disabled={isEditing}
              />
              <Button
                variant="outline"
                size="sm"
                className="whitespace-nowrap"
              >
                <Upload className="h-4 w-4 mr-1" />
                Browse
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Maximum file size: 15MB. Supported formats: JPG, PNG, WebP
            </p>
          </div>

          {previewUrl && (
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-4">
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-64 mx-auto rounded-lg shadow-sm"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Editing Instructions
            </label>
            <Textarea
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="Add a red hat, change the background to a beach, make it nighttime..."
              className="min-h-[80px] resize-none"
              disabled={isEditing}
            />
          </div>

          <Button
            onClick={handleEdit}
            disabled={isEditing || !selectedFile || !instruction.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
          >
            {isEditing ? (
              <>
                <Wand2 className="h-4 w-4 mr-2 animate-spin" />
                Editing Image...
              </>
            ) : (
              <>
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Image
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {editedImage && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg">Original Image</CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src={previewUrl}
                alt="Original"
                className="w-full rounded-lg shadow-sm"
              />
              <Button
                variant="outline"
                size="sm"
                className="mt-3 w-full"
                onClick={() => handleDownload(previewUrl, 'original-image.jpg')}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Original
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-green-200">
            <CardHeader>
              <CardTitle className="text-lg text-green-700">Edited Image</CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src={editedImage.url}
                alt="Edited"
                className="w-full rounded-lg shadow-sm"
              />
              <div className="mt-3 space-y-2">
                <div className="text-sm">
                  <strong>Instruction:</strong> {editedImage.instruction}
                </div>
                <div className="text-sm text-gray-600">
                  <strong>AI Analysis:</strong> {editedImage.description}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleDownload(editedImage.url, 'edited-image.jpg')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Edited
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default EditTab;