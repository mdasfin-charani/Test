import React from 'react';
import DynamicForm from '@/components/global/DynamicForm.jsx';
import { hubSignupConfig } from '@/config/formConfigs.js';

const HubSignup = () => {
  return <DynamicForm config={hubSignupConfig} />;
};

export default HubSignup;
