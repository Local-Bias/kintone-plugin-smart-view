import { PLUGIN_KEY } from '@/lib/statics';
import React, { FC } from 'react';
import { NewVersionAlert } from '../../ui/new-version-alert';

const Component: FC = () => {
  const hasNewVersion = JSON.parse(localStorage.getItem(PLUGIN_KEY) ?? '{}').hasNewVersion ?? false;

  return <div>{hasNewVersion && <NewVersionAlert />}</div>;
};

export default Component;