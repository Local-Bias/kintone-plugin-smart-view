import React from 'react';
import { restorePluginConfig } from '@/lib/plugin';
import { Root, createRoot } from 'react-dom/client';
import { css } from '@emotion/css';

import App from './app';
import { URL_SEARCH_PARAMS_TEXT, VIEW_ROOT_ID } from '@/lib/statics';
import { showNotification } from '@/lib/utilities';
import { listener } from '@/lib/listener';
import { getSortFromQuery } from '@konomi-app/kintone-utilities';
import { getQuery } from '@lb-ribbit/kintone-xapp';

let cachedRoot: Root | null = null;

listener.add(['app.record.index.show'], async (event) => {
  const config = restorePluginConfig();
  const targetCondition = config.conditions.find(
    (condition) => Number(condition.viewId) === event.viewId
  );
  if (!targetCondition) {
    return event;
  }

  document.body.classList.add(css`
    .gaia-argoui-app-index-pager,
    .category-left-gaia {
      display: none !important;
    }
  `);

  const rootElement =
    document.querySelector(`#${VIEW_ROOT_ID}`) ||
    document.querySelector('.gaia-app-indexview-customview-html') ||
    document.querySelector('.gaia-mobile-app-customview') ||
    document.querySelector('.contents-gaia');

  if (!rootElement) {
    showNotification({
      title: 'プラグインでエラーが発生しました',
      body: 'プラグインの一覧を表示する領域が見つかりませんでした',
    });
    return event;
  }

  const extractedSearchCondition = targetCondition.extractedInputs.map((input) => ({
    ...input,
    value: '',
  }));

  const query = new URLSearchParams(location.search);
  const sortCondition = getSortFromQuery(getQuery() || '');

  const initSearchText = query.get(URL_SEARCH_PARAMS_TEXT) ?? '';

  const root = cachedRoot || createRoot(rootElement);
  if (!cachedRoot) {
    cachedRoot = root;
  }

  root.render(
    <App
      condition={targetCondition}
      sortCondition={sortCondition}
      initSearchText={initSearchText}
      extractedSearchCondition={extractedSearchCondition}
    />
  );

  return event;
});
