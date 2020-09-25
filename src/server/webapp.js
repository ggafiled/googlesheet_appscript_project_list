const { replyMessage, MESSAGE_TYPE } = require('../functions/LineBot');

const doPost = (e) => {
  Logger.log('[doPost()] : starting function.');
  const data = JSON.parse(e.postData.contents);
  Logger.log(`[doPost()] after starting function: ${JSON.stringify(data)}`);

  const Progress = Tamotsu.Table.define({
    sheetName: 'Progress',
    rowShift: 1,
    columnShift: 0,
  });

  const messages = data.events[0].message.text;
  Logger.log(`[doPost()] extract body data: ${messages}`);

  const message = messages.trim();

  try {
    if (message !== '') {
      const query = Progress.where({
        Project: message,
      }).first();

      if (query !== undefined && query !== null) {
        Logger.log(`[doPost()] query: ${messages}`);
        replyMessage(
          data.events[0].replyToken,
          `สำรวจออกแบบ: ${query.Survey}\nติดตั้ง IFCC : ${query['IFCC (ODF)']}\nWall Box : ${query['Wall Box']}\nMicro Duct1 : ${query['Micro Duct Vertical']}\nMicro Duct2 : ${query['Micro Duct Horizontal']}`,
          MESSAGE_TYPE.NORMAL
        );
      } else {
        Logger.log(`[doPost()] ไม่เข้าเงื่อนไข 🍜🍣🍤`);
      }
    }
  } catch (error) {
    Logger.log(`[doPost()] error: ${error}`);
  }

  return ContentService.createTextOutput(
    JSON.stringify({
      status: 'ok',
    })
  ).setMimeType(ContentService.JSON);
};

module.exports = {
  doPost,
};
