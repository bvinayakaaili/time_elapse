import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GenerateTab from '@/components/tabs/GenerateTab';
import EditTab from '@/components/tabs/EditTab';
import BlendTab from '@/components/tabs/BlendTab';
import { Wand2, Edit3, Merge } from 'lucide-react';

const MainContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('generate');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Journey Through Time with AI
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transform your ideas across different eras with advanced AI image generation, 
            editing, and blending capabilities.
          </p>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-white/50 backdrop-blur-sm">
            <TabsTrigger value="generate" className="flex items-center space-x-2 text-base">
              <Wand2 className="h-4 w-4" />
              <span>Generate</span>
            </TabsTrigger>
            <TabsTrigger value="edit" className="flex items-center space-x-2 text-base">
              <Edit3 className="h-4 w-4" />
              <span>Edit</span>
            </TabsTrigger>
            <TabsTrigger value="blend" className="flex items-center space-x-2 text-base">
              <Merge className="h-4 w-4" />
              <span>Blend</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate">
            <GenerateTab />
          </TabsContent>

          <TabsContent value="edit">
            <EditTab />
          </TabsContent>

          <TabsContent value="blend">
            <BlendTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MainContent;