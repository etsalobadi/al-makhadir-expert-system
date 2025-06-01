
import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import JudicialAnnouncements from '../components/announcements/JudicialAnnouncements';

const Announcements: React.FC = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">الإعلانات القضائية</h1>
        </div>
        <JudicialAnnouncements />
      </div>
    </MainLayout>
  );
};

export default Announcements;
