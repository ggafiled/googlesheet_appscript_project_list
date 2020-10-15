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
        Logger.log(`[fmBuildingCondoName()] query: ${query}`);
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
        Logger.log(`[fmBuildingCondoName()] error: ${error}`);
    }
};

const fmBuildingOperator = async(
    replyToken,
    emptyValue = false,
    columnNameLists = [],
    headers = ''
) => {
    try {
        const Progress = Tamotsu.Table.define({
            sheetName: 'Progress',
            rowShift: 1,
            columnShift: 0,
        }, {
            operator(columnLists = []) {
                const vmThis = this;
                const columnList = columnLists.map((element) => {
                    return [vmThis[element]];
                });
                return [columnList].join('');
            },
        });
        Logger.log(`[fmBuildingOperator()] columnNameLists: ${columnNameLists}`);

        const query = Progress.where(function(doc) {
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
                replyToken,
                emptyValue ?
                `รายชื่อโครงการที่ยังไม่ถูกเชื่อมต่อโครงข่าย ${headers}\n ${
              nooperatorList.trim() === '' ? 'ไม่พบข้อมูลค่ะ' : nooperatorList
            }` :
                `รายชื่อโครงการที่ถูกเชื่อมต่อโครงข่ายแล้ว ${headers}\n ${
              nooperatorList.trim() === '' ? 'ไม่พบข้อมูลค่ะ' : nooperatorList
            }`,
                MESSAGE_TYPE.NORMAL
            );
        } else {
            await replyMessage(
                replyToken,
                emptyValue ?
                `ขออภัยค่ะ 🙏 ไม่มีรายชื่อโครงการใดที่ยังไม่ถูกเชื่อมต่อโครงข่ายค่ะ ${headers}` :
                `ขออภัยค่ะ 🙏 ไม่มีรายชื่อโครงการที่ถูกเชื่อมต่อโครงข่ายค่ะ ${headers}`,
                MESSAGE_TYPE.NORMAL
            );
        }
    } catch (error) {
        Logger.log(`[fmBuildingOperator()] error: ${error}`);
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
                    'https://script.google.com/macros/s/AKfycbxNch6dIicX2YK8DXyKyi0Ayes99Ca4FBFAXEVncQ/exec?v=project-list',
                    MESSAGE_TYPE.NORMAL
                );
                break;
            case 'no operator':
                Logger.log(`[doPost()] no operator:`);
                fmBuildingOperator(data.events[0].replyToken, true, [
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
                fmBuildingOperator(data.events[0].replyToken, false, [
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
                fmBuildingOperator(data.events[0].replyToken, true, ['TOT Progress'], '(TOT)');
                break;
            case 'tot':
                Logger.log(`[doPost()] tot:`);
                fmBuildingOperator(data.events[0].replyToken, false, ['TOT Progress'], '(TOT)');
                break;
            case 'no ais':
                Logger.log(`[doPost()] no ais:`);
                fmBuildingOperator(data.events[0].replyToken, true, ['AIS Progress'], '(AIS)');
                break;
            case 'ais':
                Logger.log(`[doPost()] ais:`);
                fmBuildingOperator(data.events[0].replyToken, false, ['AIS Progress'], '(AIS)');
                break;
            case 'no 3bb':
                Logger.log(`[doPost()] no 3bb:`);
                fmBuildingOperator(data.events[0].replyToken, true, ['3BB Progress'], '(3BB)');
                break;
            case '3bb':
                Logger.log(`[doPost()] 3bb:`);
                fmBuildingOperator(data.events[0].replyToken, false, ['3BB Progress'], '(3BB)');
                break;
            case 'no sinet':
                Logger.log(`[doPost()] no sinet:`);
                fmBuildingOperator(data.events[0].replyToken, true, ['Sinet Progress'], '(Sinet)');
                break;
            case 'sinet':
                Logger.log(`[doPost()] sinet:`);
                fmBuildingOperator(data.events[0].replyToken, false, ['Sinet Progress'], '(Sinet)');
                break;
            case 'no fn':
                Logger.log(`[doPost()] no fn:`);
                fmBuildingOperator(data.events[0].replyToken, true, ['FN Progress'], '(Fn)');
                break;
            case 'fn':
                Logger.log(`[doPost()] fn:`);
                fmBuildingOperator(data.events[0].replyToken, false, ['FN Progress'], '(Fn)');
                break;
            case 'no true':
                Logger.log(`[doPost()] no true:`);
                fmBuildingOperator(data.events[0].replyToken, true, ['True Progress'], '(True)');
                break;
            case 'true':
                Logger.log(`[doPost()] true:`);
                fmBuildingOperator(data.events[0].replyToken, false, ['True Progress'], '(True)');
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