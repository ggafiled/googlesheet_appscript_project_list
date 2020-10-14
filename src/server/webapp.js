const { render } = require('../functions/utils');
const { replyMessage, MESSAGE_TYPE } = require('../functions/LineBot');

const Route = {};
Route.path = function(routeName, callback) {
    Route[routeName] = callback;
};

function loadUi() {
    return render('index', {
        title: '- 🕵️‍♀️ Project List -',
    });
}

const fmBuildingCondoName = async(replyToken, messages) => {
    try {
        const Progress = Tamotsu.Table.define({
            sheetName: 'Progress',
            rowShift: 1,
            columnShift: 0,
        });

        const query = Progress.where({
            Project: messages.trim(),
        }).first();
        Logger.log(`[doPost()] query: ${query}`);
        if (query !== undefined && query !== null) {
            await replyMessage(
                replyToken,
                `ที่อยู่: ${query['ที่อยู่']}\nชื่อผู้ติดต่อ: ${query['ชื่อผู้ติดต่อ']}\nเบอร์โทร: ${query['เบอร์โทร']}\nEMail: ${query.EMail}\nจำนวน Tower: ${query['จำนวน Tower']}\nจำนวนชั้นต่ออาคาร: ${query['จำนวนชั้นต่ออาคาร']}\nจำนวนห้อง: ${query['จำนวนห้อง']}\nสำรวจออกแบบ: ${query['สำรวจออกแบบ']}\nIFCC (ODF) : ${query['ติดตั้ง IFCC (ODF)']}\nWall Box : ${query['Wall Box']}\nMicro Duct แนวดิ่ง : ${query['Micro Duct แนวดิ่ง']}\nMicro Duct แนวขวาง : ${query['Micro Duct แนวขวาง']}\nTOT Progress : ${query['TOT Progress']}\nAIS Progress : ${query['AIS Progress']}\n3BB Progress : ${query['3BB Progress']}`,
                MESSAGE_TYPE.NORMAL
            );
        } else {
            await replyMessage(
                replyToken,
                'ขออภัยค่ะ 🙏 ไม่พบรายชื่อโครงการดังกล่าว\n(คำแนะนำ: อาจสะกดผิดหรือเว้นวรรคผิด)',
                MESSAGE_TYPE.NORMAL
            );
        }
    } catch (error) {
        Logger.log(`[doPost()] error: ${error}`);
    }
};

const fmBuildingNoOperator = async(replyToken) => {
    try {
        const Progress = Tamotsu.Table.define({
            sheetName: 'Progress',
            rowShift: 1,
            columnShift: 0,
        }, {
            operator() {
                return [
                    this['TOT Progress'],
                    this['AIS Progress'],
                    this['3BB Progress'],
                    this['Sinet Progress'],
                    this['FN Progress'],
                    this['True Progress'],
                ].join('');
            },
        });

        const query = Progress.where(function(doc) {
            return doc.operator().trim() === '';
        }).all();
        Logger.log(`[doPost()] query: ${JSON.stringify(query)}`);
        if (query !== undefined && query !== null) {
            let nooperatorList = '';
            query.forEach((r) => {
                if (r.Project.trim() !== '') {
                    nooperatorList += `${r.Project}\n`;
                }
            });
            await replyMessage(
                replyToken,
                `รายชื่อโครงการที่ยังไม่ถูกเชื่อมต่อโครงข่าย\n ${nooperatorList}`,
                MESSAGE_TYPE.NORMAL
            );
        } else {
            await replyMessage(
                replyToken,
                'ขออภัยค่ะ 🙏 ไม่มีรายชื่อโครงการใดที่ยังไม่ถูกเชื่อมต่อโครงข่ายค่ะ',
                MESSAGE_TYPE.NORMAL
            );
        }
    } catch (error) {
        Logger.log(`[doPost()] error: ${error}`);
    }
};

const doPost = (e) => {
    const fmCommandRegex = new RegExp(
        /^(\bFM Building\b)[\s]*([ก-๏a-zA-Z 0-9$&+,:;=?@#|'<>.^*()%!-/\\/]+)/i
    );
    const data = JSON.parse(e.postData.contents);
    const messages = data.events[0].message.text;
    Logger.log(`[doPost()] messages: ${messages}`);

    if (fmCommandRegex.test(messages.trim())) {
        Logger.log(`[doPost()] fmCommandRegex.text : ${fmCommandRegex.test(messages.trim())}`);
        Logger.log(`[doPost()] fmCommandRegex ${messages.trim().match(fmCommandRegex)}`);
        switch (messages.trim().match(fmCommandRegex)[2].toLowerCase()) {
            case 'search':
                Logger.log(`[doPost()] search:`);
                replyMessage(
                    data.events[0].replyToken,
                    'https://script.google.com/macros/s/AKfycbxtBUEiPCrWkepUJm0cmXfhqoM0IZqcXEixvSFs/exec?v=project-list',
                    MESSAGE_TYPE.NORMAL
                );
                break;
            case 'no operator':
                Logger.log(`[doPost()] no operator:`);
                fmBuildingNoOperator(data.events[0].replyToken);
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