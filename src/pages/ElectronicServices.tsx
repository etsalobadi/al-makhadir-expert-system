
import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import ElectronicServices from '../components/services/ElectronicServices';

const ElectronicServicesPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">الخدمات الإلكترونية</h1>
        </div>
        <ElectronicServices />
      </div>
    </MainLayout>
  );
};

export default ElectronicServicesPage;
