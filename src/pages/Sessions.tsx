
import React from 'react';
import SessionsPortal from '../components/sessions/SessionsPortal';

const Sessions: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">بوابة الجلسات</h1>
      </div>
      <SessionsPortal />
    </div>
  );
};

export default Sessions;
