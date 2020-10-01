import { doPost, doGet } from './server/webapp';
import { filterByValue } from './functions/utils';

// eslint-disable-next-line no-global-assign
Logger = BetterLog.useSpreadsheet(
  PropertiesService.getScriptProperties().getProperty('GOOGLE_SHEET_ID').toString()
);
Tamotsu.initialize();

global.doPost = doPost;
global.doGet = doGet;
global.filterByValue = filterByValue;
