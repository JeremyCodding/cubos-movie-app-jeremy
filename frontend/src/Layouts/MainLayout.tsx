import React from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div
        className="absolute inset-0 h-full bg-cover bg-center bg-no-repeat opacity-30"
        style={{ backgroundImage: `url('/src/assets/background.jpg')` }}
      ></div>
      
      <Header />

      <main className="relative z-10 flex-grow container mx-auto px-6 py-12">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
