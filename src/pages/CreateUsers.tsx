
import React from 'react';
import CreateTestUsers from '../components/auth/CreateTestUsers';

const CreateUsersPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-amber-50 to-amber-100 p-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-judicial-primary mb-2">
          إنشاء مستخدمين تجريبيين
        </h1>
        <p className="text-gray-600">
          لاختبار النظام وتسجيل الدخول
        </p>
      </div>
      
      <CreateTestUsers />
      
      <div className="mt-8 text-center">
        <a 
          href="/login" 
          className="text-judicial-primary hover:underline"
        >
          العودة إلى صفحة تسجيل الدخول
        </a>
      </div>
    </div>
  );
};

export default CreateUsersPage;
