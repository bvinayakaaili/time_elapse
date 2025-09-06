import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import Header from '@/components/Header';
import MainContent from '@/components/MainContent';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <Header />
      <MainContent />
      <Toaster />
    </div>
  );
}

export default App;