import { selector } from 'recoil';
import { appPropertiesState } from './kintone';
import { pluginConditionState } from './plugin';
import { propertiesReadyState } from './kintone';
import { kx } from '../../types/kintone.api';

export type HeaderCell = { label: string; property: kx.FieldProperty | null };

export const headerCellsState = selector<HeaderCell[]>({
  key: 'headerCellsState',
  get: async ({ get }) => {
    const condition = get(pluginConditionState);
    const appFields = get(appPropertiesState);
    const propertiesReady = get(propertiesReadyState);

    if (!condition?.viewDisplayingFields.length) {
      return [];
    }

    if (!propertiesReady) {
      return condition.viewDisplayingFields.map((field) => ({ label: field, property: null }));
    }

    const cells = condition.viewDisplayingFields.map<HeaderCell>((fieldCode) => {
      const found = Object.values(appFields).find((property) => property.code === fieldCode);

      if (found) {
        return { label: found.label, property: found };
      }
      return { label: fieldCode, property: null };
    });

    return cells;
  },
});
