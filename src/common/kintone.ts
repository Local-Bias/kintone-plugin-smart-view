import { getAppId } from '@lb-ribbit/kintone-xapp';
import {
  detectGuestSpaceId,
  getFieldValueAsString,
  getFormFields,
  getFormLayout,
  getViews,
  kintoneAPI,
  updateViews,
} from '@konomi-app/kintone-utilities';

/** kintoneアプリに初期状態で存在するフィールドタイプ */
const DEFAULT_DEFINED_FIELDS: kintoneAPI.FieldPropertyType[] = [
  'UPDATED_TIME',
  'CREATOR',
  'CREATED_TIME',
  'CATEGORY',
  'MODIFIER',
  'STATUS',
];

const guestSpaceId = detectGuestSpaceId() ?? undefined;

const IGNORE_FIELDS: kintoneAPI.FieldPropertyType[] = ['GROUP'];

export const getAppFields = async (
  options?: Partial<{ targetApp: string | number; preview: boolean }>
) => {
  const { targetApp, preview = false } = options || {};

  const app = targetApp || getAppId();

  if (!app) {
    throw new Error('アプリのフィールド情報が取得できませんでした');
  }

  const { properties } = await getFormFields({
    app,
    guestSpaceId,
    preview,
    debug: process.env.NODE_ENV === 'development',
  });

  return properties;
};

export const getUserDefinedFields = async (): Promise<kintoneAPI.FieldProperties> => {
  const fields = await getAppFields();

  const filtered = Object.entries(fields).filter(
    ([_, value]) => !DEFAULT_DEFINED_FIELDS.includes(value.type)
  );

  return filtered.reduce<kintoneAPI.FieldProperties>(
    (acc, [key, value]) => ({ ...acc, [key]: value }),
    {}
  );
};

export const getFieldsWithoutIgnores = async (
  options?: Partial<{ targetApp: string | number; preview: boolean }>
): Promise<kintoneAPI.FieldProperties> => {
  const fields = await getAppFields(options);

  const filtered = Object.entries(fields).filter(
    ([_, value]) => !IGNORE_FIELDS.includes(value.type)
  );

  return filtered.reduce<kintoneAPI.FieldProperties>(
    (acc, [key, value]) => ({ ...acc, [key]: value }),
    {}
  );
};

export const getAppLayout = async () => {
  const app = getAppId();

  if (!app) {
    throw new Error('アプリのフィールド情報が取得できませんでした');
  }

  const { layout } = await getFormLayout({
    app,
    guestSpaceId,
    debug: process.env.NODE_ENV === 'development',
  });

  return layout;
};

export const getAppViews = async () => {
  const app = getAppId();

  if (!app) {
    throw new Error('アプリのフィールド情報が取得できませんでした');
  }

  const { views } = await getViews({ app });

  return views;
};

export const updateAppViews = async (views: Record<string, kintoneAPI.view.Parameter>) => {
  const app = getAppId();

  if (!app) {
    throw new Error('アプリのフィールド情報が取得できませんでした');
  }

  return updateViews({ app, views, guestSpaceId, debug: process.env.NODE_ENV === 'development' });
};

export const getQuickSearchString = (record: kintoneAPI.RecordData): string => {
  const separator = '_';

  const values = Object.values(record).map((field) => getFieldValueAsString(field, { separator }));

  return values.join(separator);
};
