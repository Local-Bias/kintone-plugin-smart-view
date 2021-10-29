import { someField } from '@common/kintone';
import { Record } from '@kintone/rest-api-client/lib/client/types';
import { selector } from 'recoil';
import { allReceivedRecordsState } from './all-received-records';
import { searchTextState } from './search-text';

export const filteredRecordsState = selector<Record[]>({
  key: 'filteredRecordsState',
  get: ({ get }) => {
    const records = get(allReceivedRecordsState);
    const input = get(searchTextState);

    const words = input.split(/\s+/g);

    return records.filter((record) => words.every((word) => someField(record, word)));
  },
});
