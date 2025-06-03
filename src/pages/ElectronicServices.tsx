
import React from 'react';
import ModernLayout from '../components/layout/ModernLayout';
import ElectronicServices from '../components/services/ElectronicServices';

const ElectronicServicesPage: React.FC = () => {
  return (
    <ModernLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">الخدمات الإلكترونية</h1>
        </div>
        <ElectronicServices />
      </div>
    </ModernLayout>
  );
};

export default ElectronicServicesPage;
