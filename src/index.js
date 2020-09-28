import { doPost } from './server/webapp';

// eslint-disable-next-line no-global-assign
Logger = BetterLog.useSpreadsheet(
  PropertiesService.getScriptProperties().getProperty('GOOGLE_SHEET_ID').toString()
);
Tamotsu.initialize();

global.doPost = doPost;
