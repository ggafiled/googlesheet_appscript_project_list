const { render } = require('../functions/utils');
const { replyMessage, MESSAGE_TYPE } = require('../functions/LineBot');

const Route = {};
Route.path = function (routeName, callback) {
  Route[routeName] = callback;
};

var fmCommandRegex = /^(FM Building) [a-zA-Z0-9ก-๙]$/;

function loadUi() {
  return render('index', {
    title: '- 🕵️‍♀️ Project List -',
  });
}

const doPost = (e) => {
  const data = JSON.parse(e.postData.contents);
  let messages = data.events[0].message.text;
  const Progress = Tamotsu.Table.define({
    sheetName: 'Progress',
    rowShift: 1,
    columnShift: 0,
  });

  if (messages.trim() === 'FM Building Search') {
    replyMessage(
      data.events[0].replyToken,
      'https://liff.line.me/1655032626-V4QkoRMZ',
      MESSAGE_TYPE.NORMAL
    );
  } else {
    messages = messages.trim();

    try {
      if (messages.trim().indexOf('FM Building') > -1) {
        let keyword = messages.trim()
        const query = Progress.where({
          Project: messages,
        }).first();

        if (query !== undefined && query !== null) {
          Logger.log(`[doPost()] query: ${messages}`);
          replyMessage(
            data.events[0].replyToken,
            `ที่อยู่: ${query['ที่อยู่']}\nติดตั้ง 
            ชื่อผู้ติดต่อ: ${query['ชื่อผู้ติดต่อ']}\nติดตั้ง 
            เบอร์โทร: ${query['เบอร์โทร']}\nติดตั้ง 
            EMail: ${query['EMail']}\nติดตั้ง 
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
      }
    } catch (error) {
      Logger.log(`[doPost()] error: ${error}`);
    }
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
