
import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-200 py-4 px-6 mt-auto">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">
          جميع الحقوق محفوظة &copy; {currentYear} - مركز خبراء القضاء بالمخادر
        </p>
        <div className="flex items-center space-x-4 space-x-reverse">
          <span className="text-sm text-gray-500">إصدار 1.0.0</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
