import React from 'react';
import { Outlet } from 'react-router-dom';
import { EmployeeProvider } from '@/pages/hub-admin/Employees/context/EmployeeContext';

const EmployeeLayout = () => {
  return (
    <EmployeeProvider>
      <Outlet />
    </EmployeeProvider>
  );
};

export default EmployeeLayout;
