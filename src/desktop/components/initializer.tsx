import { useEffect, VFC } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { getAppId, getQueryCondition, getQuickSearchString } from '@common/kintone';
import { getAllRecords } from '@common/kintone-rest-api';

import { allViewRecordsState } from '../states/records';
import { loadingState } from '../states/loading';
import { pluginConditionState } from '../states/plugin-condition';
import { ViewRecord } from '../static';

const Container: VFC = () => {
  const setAllRecords = useSetRecoilState(allViewRecordsState);
  const setLoading = useSetRecoilState(loadingState);
  const condition = useRecoilValue(pluginConditionState);

  useEffect(() => {
    (async () => {
      if (!condition) {
        return;
      }
      setLoading(true);
      try {
        const app = getAppId();

        if (!app) {
          throw new Error('アプリ情報が取得できませんでした');
        }

        const query = getQueryCondition() || '';

        const targetFields = condition.viewDisplayingFields.filter((field) => !!field);
        const fields = ['$id', ...targetFields];

        await getAllRecords({
          app,
          query,
          fields,
          onAdvance: (records) => {
            const viewRecords = records.map<ViewRecord>((record) => {
              let __quickSearch = getQuickSearchString(record);

              if (condition.ignoresLetterCase) {
                __quickSearch = __quickSearch.toLowerCase();
              }

              return { record, __quickSearch };
            });
            setAllRecords(viewRecords);
          },
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [condition]);

  return null;
};

export default Container;
