const { render } = require('../functions/utils');
const { replyMessage, MESSAGE_TYPE } = require('../functions/LineBot');

const Route = {};
Route.path = function (routeName, callback) {
  Route[routeName] = callback;
};

function loadUi() {
  return render('index', {
    title: '- 🕵️‍♀️ Project List -',
  });
}

const fmBuildingCondoName = async (replyToken, messages) => {
  try {
    const Progress = Tamotsu.Table.define({
      sheetName: 'Progress',
      rowShift: 1,
      columnShift: 0,
    });

    const query = Progress.where({
      Project: messages,
    }).first();

    if (query !== undefined && query !== null) {
      Logger.log(`[doPost()] query: ${messages}`);
      await replyMessage(
        replyToken,
        `ที่อยู่: ${query['ที่อยู่']}\nชื่อผู้ติดต่อ: ${query['ชื่อผู้ติดต่อ']}\nเบอร์โทร: ${query['เบอร์โทร']}\nEMail: ${query.EMail}\nจำนวน Tower: ${query['จำนวน Tower']}\nจำนวนชั้นต่ออาคาร: ${query['จำนวนชั้นต่ออาคาร']}\nจำนวนห้อง: ${query['จำนวนห้อง']}\nสำรวจออกแบบ: ${query['สำรวจออกแบบ']}\nIFCC (ODF) : ${query['ติดตั้ง IFCC (ODF)']}\nWall Box : ${query['Wall Box']}\nMicro Duct แนวดิ่ง : ${query['Micro Duct แนวดิ่ง']}\nMicro Duct แนวขวาง : ${query['Micro Duct แนวขวาง']}\nTOT Progress : ${query['TOT Progress']}\nAIS Progress : ${query['AIS Progress']}\n3BB Progress : ${query['3BB Progress']}`,
        MESSAGE_TYPE.NORMAL
      );
    }
  } catch (error) {
    Logger.log(`[doPost()] error: ${error}`);
  }
};

const doPost = (e) => {
  const fmCommandRegex = new RegExp(
    /^(\bFM Building\b)[\s]*([ก-๏a-zA-Z 0-9$&+,:;=?@#|'<>.^*()%!-]+)/
  );
  const data = JSON.parse(e.postData.contents);
  const messages = data.events[0].message.text;
  Logger.log(`[doPost()] messages: ${messages}`);

  if (fmCommandRegex.test(messages.trim())) {
    Logger.log(`[doPost()] fmCommandRegex.text : ${fmCommandRegex.test(messages.trim())}`);
    Logger.log(`[doPost()] fmCommandRegex ${messages.trim().match(fmCommandRegex)}`);
    switch (messages.trim().match(fmCommandRegex)[2]) {
      case 'Search':
        Logger.log(`[doPost()] Search:`);
        replyMessage(
          data.events[0].replyToken,
          'https://script.google.com/macros/s/AKfycbxtBUEiPCrWkepUJm0cmXfhqoM0IZqcXEixvSFs/exec?v=project-list',
          MESSAGE_TYPE.NORMAL
        );
        break;
      default:
        Logger.log(`[doPost()] default:`);
        fmBuildingCondoName(
          data.events[0].replyToken,
          String(messages.trim().match(fmCommandRegex)[2])
        );
        break;
    }
  } else {
    Logger.log(`[doPost()] fmCommandRegex.text : ${fmCommandRegex.test(messages.trim())}`);
  }
  return ContentService.createTextOutput(
    JSON.stringify({
      status: 'ok',
    })
  ).setMimeType(ContentService.JSON);
};

const doGet = (e) => {
  Route.path('project-list', loadUi);
  if (Route[e.parameters.v]) {
    return Route[e.parameters.v]();
  }
  return render('404');
};

module.exports = {
  doGet,
  doPost,
};
