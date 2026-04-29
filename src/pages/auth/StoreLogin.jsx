import React from 'react';
import DynamicLoginForm from '@/components/global/DynamicLoginForm.jsx';
import { storeLoginConfig } from '@/config/formConfigs.js';

const StoreLogin = () => {
  return <DynamicLoginForm config={storeLoginConfig} />;
};

export default StoreLogin;
