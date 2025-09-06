import React from 'react';
import { Sparkles, Clock } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Clock className="h-8 w-8 text-purple-600" />
              <Sparkles className="h-4 w-4 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Era Whisperer
              </h1>
              <p className="text-sm text-gray-600">AI-Powered Time Travel Through Images</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Powered by Gemini AI</p>
            <p className="text-xs text-gray-400">Generate • Edit • Blend</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;