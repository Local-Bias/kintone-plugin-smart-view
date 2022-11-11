import React, { FC } from 'react';
import { DeepReadonly } from 'utility-types';
import { useRecoilValue } from 'recoil';
import { displayingRecordsState } from '../../../states/records';
import { pluginConditionState } from '../../../states/plugin';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

import Cell from './cell';
import { getQueryString } from '@common/cybozu';
import { isMobile } from '@lb-ribbit/kintone-xapp';
import { kx } from '../../../../types/kintone.api';

type Props = DeepReadonly<{ records: kx.RecordData[]; condition: kintone.plugin.Condition }>;

const Component: FC<Props> = ({ records, condition }) => (
  <tbody>
    {records.map((record, i) => (
      <tr key={i}>
        <td>
          <a
            href={`${location.pathname}show${isMobile() ? '?' : '#'}record=${
              record.$id.value
            }&l.view=${condition.viewId}&l.q${getQueryString() ? `=${getQueryString()}` : ''}`}
          >
            <InsertDriveFileIcon />
          </a>
        </td>
        {condition.viewDisplayingFields.map((field, j) => (
          <td key={j} className={['NUMBER', 'CALC'].includes(record[field]?.type) ? 'right' : ''}>
            <Cell code={field} field={record[field]} />
          </td>
        ))}
      </tr>
    ))}
  </tbody>
);

const Container: FC = () => {
  const records = useRecoilValue(displayingRecordsState);
  const condition = useRecoilValue(pluginConditionState)!;

  return <Component {...{ records, condition }} />;
};

export default Container;
