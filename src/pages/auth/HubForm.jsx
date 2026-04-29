import React from 'react';
import DynamicForm from '@/components/global/DynamicForm.jsx';
import { hubFormConfig } from '@/config/formConfigs.js';

const HubForm = () => {
  return <DynamicForm config={hubFormConfig} />;
};

export default HubForm;
