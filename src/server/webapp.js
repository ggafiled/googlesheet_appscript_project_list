const { render } = require('../functions/utils');
const {
    replyMessage,
    MESSAGE_TYPE,
    sendLineNotify,
    getUserProfile,
} = require('../functions/LineBot');

const Route = {};
Route.path = function(routeName, callback) {
    Route[routeName] = callback;
};

function loadUi() {
    return render('index');
}

const fmBuildingCondoName = async(sourceObj, messages) => {
        try {
            let userProfile = {};
            try {
                userProfile = await getUserProfile(sourceObj.source.userId, sourceObj.source.groupId);
                userProfile.displayName = userProfile.displayName ? userProfile.displayName : 'ไม่ทราบชื่อ';
                Logger.log(`[sendLineNotify()] user information.${userProfile}`);
                await sendLineNotify(
                        `ได้รับคำสั่งจากคุณ ${
          userProfile.displayName !== '' ? `@${userProfile.displayName}` : 'ไม่ทราบชื่อ'
        } แล้วค่ะ`
      );
      Logger.log(`[sendLineNotify()] ได้รับคำสั่งจากคุณ 
                ${
                  userProfile.displayName !== '' ? `@${userProfile.displayName}` : 'ไม่ทราบชื่อ'
                } แล้วค่ะ`);
    } catch (error) {
      Logger.log('[sendLineNotify()] fails.');
    }

    const Progress = Tamotsu.Table.define({
      sheetName: 'Progress',
      rowShift: 1,
      columnShift: 0,
    });

    const query = Progress.where({
      Project: messages.trim(),
    }).first();
    Logger.log(`[fmBuildingCondoName()] query: ${query}`);
    if (query !== undefined && query !== null) {
      await replyMessage(
        sourceObj.replyToken,
        `คุณ ${
          userProfile.displayName !== '' ? `@${userProfile.displayName}` : 'ไม่ทราบชื่อ'
        }\nที่อยู่: ${query['ที่อยู่']}\nชื่อผู้ติดต่อ: ${query['ชื่อผู้ติดต่อ']}\nเบอร์โทร: ${
          query['เบอร์โทร']
        }\nEMail: ${query.EMail}\nจำนวน Tower: ${query['จำนวน Tower']}\nจำนวนชั้นต่ออาคาร: ${
          query['จำนวนชั้นต่ออาคาร']
        }\nจำนวนห้อง: ${query['จำนวนห้อง']}\nสำรวจออกแบบ: ${query['สำรวจออกแบบ']}\nIFCC (ODF) : ${
          query['ติดตั้ง IFCC (ODF)']
        }\nWall Box : ${query['Wall Box']}\nMicro Duct แนวดิ่ง : ${
          query['Micro Duct แนวดิ่ง']
        }\nMicro Duct แนวขวาง : ${query['Micro Duct แนวขวาง']}\nTOT Progress : ${
          query['TOT Progress']
        }\nAIS Progress : ${query['AIS Progress']}\n3BB Progress : ${query['3BB Progress']}`,
        MESSAGE_TYPE.NORMAL
      );
    } else {
      await replyMessage(
        sourceObj.replyToken,
        `คุณ ${
          userProfile.displayName !== '' ? `@${userProfile.displayName}` : 'ไม่ทราบชื่อ'
        }\nขออภัยค่ะ 🙏 ไม่พบรายชื่อโครงการดังกล่าว\n(คำแนะนำ: อาจสะกดผิดหรือเว้นวรรคผิด)`,
        MESSAGE_TYPE.NORMAL
      );
    }
  } catch (error) {
    Logger.log(`[fmBuildingCondoName()] error: ${error}`);
  }
};

const fmBuildingOperator = async (
  sourceObj,
  emptyValue = false,
  columnNameLists = [],
  headers = ''
) => {
  try {
    let userProfile = {};
    try {
      userProfile = await getUserProfile(sourceObj.source.userId, sourceObj.source.groupId);
      userProfile.displayName = userProfile.displayName ? userProfile.displayName : 'ไม่ทราบชื่อ';
      Logger.log(`[sendLineNotify()] user information.${userProfile}`);
      await sendLineNotify(
        `ได้รับคำสั่งจากคุณ ${
          userProfile.displayName !== '' ? `@${userProfile.displayName}` : 'ไม่ทราบชื่อ'
        } แล้วค่ะ`
      );
    } catch (error) {
      Logger.log('[sendLineNotify()] fails.');
    }
    const Progress = Tamotsu.Table.define(
      {
        sheetName: 'Progress',
        rowShift: 1,
        columnShift: 0,
      },
      {
        operator(columnLists = []) {
          const vmThis = this;
          const columnList = columnLists.map((element) => {
            return [vmThis[element]];
          });
          return [columnList].join('');
        },
      }
    );
    Logger.log(`[fmBuildingOperator()] columnNameLists: ${columnNameLists}`);

    const query = Progress.where(function (doc) {
      if (emptyValue) {
        return doc.operator(columnNameLists).trim() === '';
      }
      return doc.operator(columnNameLists).trim() !== '';
    }).all();
    Logger.log(`[fmBuildingOperator()] query: ${JSON.stringify(query)}`);
    if (query !== undefined && query !== null) {
      let nooperatorList = '';
      query.forEach((r) => {
        if (r.Project.trim() !== '') {
          nooperatorList += `${r.Project}\n`;
        }
      });
      await replyMessage(
        sourceObj.replyToken,
        emptyValue
          ? `คุณ ${
              userProfile.displayName !== '' ? `@${userProfile.displayName}` : 'ไม่ทราบชื่อ'
            } รายชื่อโครงการที่ยังไม่ถูกเชื่อมต่อโครงข่าย ${headers}\n ${
              nooperatorList.trim() === '' ? 'ไม่พบข้อมูลค่ะ' : nooperatorList
            }`
          : `คุณ ${
              userProfile.displayName !== '' ? `@${userProfile.displayName}` : 'ไม่ทราบชื่อ'
            } รายชื่อโครงการที่ถูกเชื่อมต่อโครงข่ายแล้ว ${headers}\n ${
              nooperatorList.trim() === '' ? 'ไม่พบข้อมูลค่ะ' : nooperatorList
            }`,
        MESSAGE_TYPE.NORMAL
      );
    } else {
      await replyMessage(
        sourceObj.replyToken,
        emptyValue
          ? `ขออภัยค่ะ 🙏 คุณ ${
              userProfile.displayName !== '' ? `@${userProfile.displayName}` : 'ไม่ทราบชื่อ'
            } ไม่มีรายชื่อโครงการใดที่ยังไม่ถูกเชื่อมต่อโครงข่ายค่ะ ${headers}`
          : `ขออภัยค่ะ 🙏 คุณ ${
              userProfile.displayName !== '' ? `@${userProfile.displayName}` : 'ไม่ทราบชื่อ'
            } ไม่มีรายชื่อโครงการที่ถูกเชื่อมต่อโครงข่ายค่ะ ${headers}`,
        MESSAGE_TYPE.NORMAL
      );
    }
  } catch (error) {
    Logger.log(`[fmBuildingOperator()] error: ${error}`);
  }
};

const doPost = async (e) => {
  const fmCommandRegex = new RegExp(
    /^(\bFM Building\b)[\s]*([ก-๏a-zA-Z 0-9$&+,:;=?@#|'<>.^*()%!-/\\/]+)/i
  );
  const data = JSON.parse(e.postData.contents);
  Logger.log(`[doPost()] data: ${JSON.stringify(data)}`);
  const messages = data.events[0].message.text;
  Logger.log(`[doPost()] messages: ${messages}`);

  if (fmCommandRegex.test(messages.trim())) {
    Logger.log(`[doPost()] fmCommandRegex.text : ${fmCommandRegex.test(messages.trim())}`);
    Logger.log(`[doPost()] fmCommandRegex ${messages.trim().match(fmCommandRegex)}`);
    switch (messages.trim().match(fmCommandRegex)[2].toLowerCase()) {
      case 'search':
        Logger.log(`[doPost()] search:`);
        await replyMessage(
          data.events[0].replyToken,
          'https://script.google.com/macros/s/AKfycbxNch6dIicX2YK8DXyKyi0Ayes99Ca4FBFAXEVncQ/exec?v=project-list',
          MESSAGE_TYPE.NORMAL
        );
        break;
      case 'no operator':
        Logger.log(`[doPost()] no operator:`);
        await fmBuildingOperator(data.events[0], true, [
          'TOT Progress',
          'AIS Progress',
          '3BB Progress',
          'Sinet Progress',
          'FN Progress',
          'True Progress',
        ]);
        break;
      case 'operator':
        Logger.log(`[doPost()] operator:`);
        await fmBuildingOperator(data.events[0], false, [
          'TOT Progress',
          'AIS Progress',
          '3BB Progress',
          'Sinet Progress',
          'FN Progress',
          'True Progress',
        ]);
        break;
      case 'no tot':
        Logger.log(`[doPost()] no tot:`);
        await fmBuildingOperator(data.events[0], true, ['TOT Progress'], '(TOT)');
        break;
      case 'tot':
        Logger.log(`[doPost()] tot:`);
        await fmBuildingOperator(data.events[0], false, ['TOT Progress'], '(TOT)');
        break;
      case 'no ais':
        Logger.log(`[doPost()] no ais:`);
        await fmBuildingOperator(data.events[0], true, ['AIS Progress'], '(AIS)');
        break;
      case 'ais':
        Logger.log(`[doPost()] ais:`);
        await fmBuildingOperator(data.events[0], false, ['AIS Progress'], '(AIS)');
        break;
      case 'no 3bb':
        Logger.log(`[doPost()] no 3bb:`);
        await fmBuildingOperator(data.events[0], true, ['3BB Progress'], '(3BB)');
        break;
      case '3bb':
        Logger.log(`[doPost()] 3bb:`);
        await fmBuildingOperator(data.events[0], false, ['3BB Progress'], '(3BB)');
        break;
      case 'no sinet':
        Logger.log(`[doPost()] no sinet:`);
        await fmBuildingOperator(data.events[0], true, ['Sinet Progress'], '(Sinet)');
        break;
      case 'sinet':
        Logger.log(`[doPost()] sinet:`);
        await fmBuildingOperator(data.events[0], false, ['Sinet Progress'], '(Sinet)');
        break;
      case 'no fn':
        Logger.log(`[doPost()] no fn:`);
        await fmBuildingOperator(data.events[0], true, ['FN Progress'], '(Fn)');
        break;
      case 'fn':
        Logger.log(`[doPost()] fn:`);
        await fmBuildingOperator(data.events[0], false, ['FN Progress'], '(Fn)');
        break;
      case 'no true':
        Logger.log(`[doPost()] no true:`);
        await fmBuildingOperator(data.events[0], true, ['True Progress'], '(True)');
        break;
      case 'true':
        Logger.log(`[doPost()] true:`);
        await fmBuildingOperator(data.events[0], false, ['True Progress'], '(True)');
        break;
      default:
        Logger.log(`[doPost()] default:`);
        await fmBuildingCondoName(data.events[0], String(messages.trim().match(fmCommandRegex)[2]));
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