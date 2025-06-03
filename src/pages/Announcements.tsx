
import React from 'react';
import ModernLayout from '../components/layout/ModernLayout';
import JudicialAnnouncements from '../components/announcements/JudicialAnnouncements';

const Announcements: React.FC = () => {
  return (
    <ModernLayout>
      <JudicialAnnouncements />
    </ModernLayout>
  );
};

export default Announcements;
