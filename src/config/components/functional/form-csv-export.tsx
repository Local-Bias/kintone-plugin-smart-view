import { FormControlLabel, Switch } from '@mui/material';
import React, { FC, memo } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { enableCSVExportState } from '../../states/plugin';
import { useConditionIndex } from '../condition-index-provider';

const Component: FC = () => {
  const conditionIndex = useConditionIndex();
  const enables = useRecoilValue(enableCSVExportState(conditionIndex));

  const onChange = useRecoilCallback(
    ({ set }) =>
      (checked: boolean) => {
        set(enableCSVExportState(conditionIndex), checked);
      },
    [conditionIndex]
  );

  return (
    <FormControlLabel
      control={<Switch color='primary' checked={enables} />}
      onChange={(_, checked) => onChange(checked)}
      label='CSV出力機能を有効にする'
    />
  );
};

export default memo(Component);