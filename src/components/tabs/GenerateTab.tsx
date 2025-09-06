import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Wand2, Download, Clock, Sparkles } from 'lucide-react';
import ImageGallery from '@/components/ImageGallery';

interface GeneratedImage {
  url: string;
  era: string;
  prompt: string;
  timestamp: string;
}

const GenerateTab: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [selectedEra, setSelectedEra] = useState(2000);
  const { toast } = useToast();

  const eras = [
    { year: 1900, label: '1900s', description: 'Victorian Era', color: 'sepia' },
    { year: 1950, label: '1950s', description: 'Golden Age', color: 'pink' },
    { year: 2000, label: '2000s', description: 'Digital Age', color: 'blue' },
    { year: 2050, label: '2050s', description: 'Future Vision', color: 'purple' },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Missing prompt",
        description: "Please enter a description for your image.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    const newImages: GeneratedImage[] = [];

    try {
      for (let i = 0; i < eras.length; i++) {
        const era = eras[i];
        setProgress((i / eras.length) * 100);

        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: prompt,
            era: era.year.toString(),
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to generate image for ${era.year}`);
        }

        const result = await response.json();
        newImages.push({
          url: result.data.url,
          era: era.year.toString(),
          prompt: result.data.prompt,
          timestamp: result.data.timestamp,
        });
      }

      setProgress(100);
      setGeneratedImages(newImages);
      toast({
        title: "Images generated successfully!",
        description: `Generated ${newImages.length} images across different eras.`,
      });
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: "Generation failed",
        description: "Please try again with a different prompt.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wand2 className="h-5 w-5 text-purple-600" />
            <span>Era Generation</span>
          </CardTitle>
          <CardDescription>
            Describe your scene and we'll create it across four different time periods
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Describe your image
            </label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A person walking in a park on a sunny afternoon..."
              className="min-h-[100px] resize-none"
              disabled={isGenerating}
            />
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {prompt.length}/500 characters
            </div>
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isGenerating ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate All Eras
                </>
              )}
            </Button>
          </div>

          {isGenerating && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Generating images...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Era Selector */}
      {generatedImages.length > 0 && (
        <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
          <CardHeader>
            <CardTitle>Time Period Explorer</CardTitle>
            <CardDescription>
              Slide to explore your image across different eras
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="px-3">
                <Slider
                  value={[selectedEra]}
                  onValueChange={(value) => setSelectedEra(value[0])}
                  min={1900}
                  max={2050}
                  step={50}
                  className="w-full"
                />
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                {eras.map((era) => (
                  <div
                    key={era.year}
                    className={`text-center cursor-pointer transition-colors ${
                      selectedEra === era.year ? 'text-purple-600 font-semibold' : 'hover:text-purple-500'
                    }`}
                    onClick={() => setSelectedEra(era.year)}
                  >
                    <div>{era.label}</div>
                    <div className="text-xs">{era.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {generatedImages.length > 0 && (
        <ImageGallery 
          images={generatedImages} 
          selectedEra={selectedEra.toString()}
          eras={eras}
        />
      )}
    </div>
  );
};

export default GenerateTab;