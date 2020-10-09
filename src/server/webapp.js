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
        `ที่อยู่: ${query['ที่อยู่']}\nติดตั้ง 
                ชื่อผู้ติดต่อ: ${query['ชื่อผู้ติดต่อ']}\nติดตั้ง 
                เบอร์โทร: ${query['เบอร์โทร']}\nติดตั้ง 
                EMail: ${query.EMail}\nติดตั้ง 
                จำนวน Tower: ${query['จำนวน Tower']}\nติดตั้ง 
                จำนวนชั้นต่ออาคาร: ${query['จำนวนชั้นต่ออาคาร']}\nติดตั้ง 
                จำนวนห้อง: ${query['จำนวนห้อง']}\nติดตั้ง 
                สำรวจออกแบบ: ${query['สำรวจออกแบบ']}\nติดตั้ง 
                IFCC (ODF) : ${query['ติดตั้ง IFCC (ODF)']}\n
                Wall Box : ${query['Wall Box']}\n
                Micro Duct แนวดิ่ง : ${query['Micro Duct แนวดิ่ง']}\n
                Micro Duct แนวขวาง : ${query['Micro Duct แนวขวาง']}\n
                TOT Progress : ${query['TOT Progress']}\n
                AIS Progress : ${query['AIS Progress']}\n
                3BB Progress : ${query['3BB Progress']}`,
        MESSAGE_TYPE.NORMAL
      );
    }
  } catch (error) {
    Logger.log(`[doPost()] error: ${error}`);
  }
};

const doPost = (e) => {
  const fmCommandRegex = new RegExp(
    /^(FM Building)[\s]*([\p{Latin}\p{Thai} 0-9$&+,:;=?@#|'<>.^*()%!-]+)/
  );
  const data = JSON.parse(e.postData.contents);
  const messages = data.events[0].message.text;
  Logger.log(`[doPost()] messages: ${messages}`);

  if (fmCommandRegex.test(messages.trim())) {
    Logger.log(`[doPost()] fmCommandRegex`);
    Logger.log(fmCommandRegex.match(messages.trim()));
    switch (String(fmCommandRegex.match(messages.trim())[2])) {
      case 'Search':
        Logger.log(`[doPost()] Search: ${fmCommandRegex.match(messages.trim())}`);
        replyMessage(
          data.events[0].replyToken,
          'https://liff.line.me/1655032626-V4QkoRMZ',
          MESSAGE_TYPE.NORMAL
        );
        break;
      default:
        Logger.log(`[doPost()] default: ${fmCommandRegex.match(messages.trim())}`);
        fmBuildingCondoName(
          data.events[0].replyToken,
          String(fmCommandRegex.match(messages.trim())[2])
        );
        break;
    }
  } else {
    Logger.log(`[doPost()] fmCommandRegex.text : ${fmCommandRegex.test(messages.trim())}`);
    Logger.log(`[doPost()] fmCommandRegex.match : ${fmCommandRegex.match(messages.trim())}`);
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
