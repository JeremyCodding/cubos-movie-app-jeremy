import React from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div
        className="absolute inset-0 h-full bg-cover bg-center bg-no-repeat opacity-30"
        style={{ backgroundImage: `url('../assets/background.jpg')` }}
      ></div>
      <div className="inset-0 bg-black bg-opacity-60 z-0"></div>
      <Header />
      <main className="relative z-10 flex-grow flex items-center justify-center w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default AuthLayout;
