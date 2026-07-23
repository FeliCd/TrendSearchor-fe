import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ROLES } from '@/constants/roles';
import LecturerDashboard from './LecturerDashboard';
import StudentDashboard from './StudentDashboard';

export default function AcademicDashboardPage() {
  const { user } = useAuth();

  if (user?.role === ROLES.LECTURER) {
    return <LecturerDashboard />;
  }
  
  // Default to Student Dashboard for ROLES.STUDENT or others accessing this route
  return <StudentDashboard />;
}
