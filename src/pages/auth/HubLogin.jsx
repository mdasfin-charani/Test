import React from 'react';
import DynamicLoginForm from '@/components/global/DynamicLoginForm.jsx';
import { hubLoginConfig } from '@/config/formConfigs.js';

const HubLogin = () => {
  return <DynamicLoginForm config={hubLoginConfig} />;
};

export default HubLogin;