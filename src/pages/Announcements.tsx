
import React from 'react';
import ModernLayout from '../components/layout/ModernLayout';
import JudicialAnnouncements from '../components/announcements/JudicialAnnouncements';

const Announcements: React.FC = () => {
  return (
    <ModernLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">الإعلانات القضائية</h1>
            <p className="text-gray-600 mt-2">إدارة ومتابعة الإعلانات القضائية للمحكمة</p>
          </div>
        </div>
        <JudicialAnnouncements />
      </div>
    </ModernLayout>
  );
};

export default Announcements;
