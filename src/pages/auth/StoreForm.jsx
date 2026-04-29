import React from 'react';
import DynamicForm from '@/components/global/DynamicForm.jsx';
import { storeFormConfig } from '@/config/formConfigs.js';

const StoreForm = () => {
  return <DynamicForm config={storeFormConfig} />;
};

export default StoreForm;
