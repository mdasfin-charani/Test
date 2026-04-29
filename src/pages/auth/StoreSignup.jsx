import React from 'react';
import DynamicForm from '@/components/global/DynamicForm.jsx';
import { storeSignupConfig } from '@/config/formConfigs.js';

const StoreSignup = () => {
  return <DynamicForm config={storeSignupConfig} />;
};

export default StoreSignup;
