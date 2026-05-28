import React from 'react';
import { HeartPulse } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer text-center">
      <div className="container flex-col items-center gap-4">
        <div className="flex items-center justify-center gap-2 text-primary mb-4">
          <HeartPulse size={28} />
          <span className="text-xl font-bold text-white">HealthConnect</span>
        </div>
        <p className="text-gray-light max-w-md mx-auto mb-6">
          A smart community-driven digital platform that combines health awareness, sanitation reporting, and rapid response coordination.
        </p>
        <div className="flex justify-center gap-4 text-sm text-gray">
          <span>&copy; {new Date().getFullYear()} HealthConnect. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
