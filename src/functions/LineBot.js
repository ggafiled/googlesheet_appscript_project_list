const {
    getDataFromRange,
    setDataToStore,
    isEmpty
} = require("./utils.js");

const LINE_NOTIFY_URL = 'https://notify-api.line.me/api/notify';
const LINE_MESSAGE_REPLY_URL = 'https://api.line.me/v2/bot/message/reply';
const LINE_NOTIFY_TOKEN = 'p9QvBVBeh3apZU9mvJxHC9oqMIL773v0Fs7JgvU6elj';
const LINE_CHANEL_ACCESS_TOKEN = 'dUsXN61Ww5fSwME8jFrxYHa3qD5oQav6ut6IFQlPfOxh5QnWEdi4sCLLONQAo3381MtZlOWKbK8OdHmOjc0+8FnsYrrMEFKIxGH+D3lQVr4J5pqtLYreOu/8FMOCRr1XB0P6uKBtoudfOmuCTicZIAdB04t89/1O/w1cDnyilFU=';
const MESSAGE_TYPE = {
    NORMAL: 'Normal',
    QUICKREPLY: 'Quickreply'
};

function sendLineNotify() {

    if (String(LINE_NOTIFY_TOKEN).trim() == "") {
        Logger.log("[sendLineNotify()] : empty line token.");
        return;
    }

    Logger.log("[sendLineNotify()] : starting function.");
    var formData = {
        "message": "ทำการอัพเดตสต็อคสินค้าเรียบร้อยแล้ว\n" +
            "เริ่มต้นเมื่อ: " + Utilities.formatDate(getDataFromRange("StoreData", "B2"), "GMT+7", "d MMMM Y") + " " + new Date(getDataFromRange("StoreData", "B3")).toLocaleTimeString("th-TH", "HH:MM:ss") + "\n" +
            "ใช้เวลา " + getDataFromRange("StoreData", "B4") + " วินาที\n" +
            "บุคคลกระทำการ: " + getDataFromRange("StoreData", "B1")
    };
    var options = {
        'method': 'post',
        'contentType': 'application/x-www-form-urlencoded',
        "headers": {
            "Authorization": "Bearer " + LINE_NOTIFY_TOKEN,
        },
        'payload': formData
    };

    let response = UrlFetchApp.fetch(LINE_NOTIFY_URL, options);
    Logger.log("[sendLineNotify()] : response: " + response);
}

function replyMessage(replytoken, replyText, type, items = []) {
    try {
        var response = UrlFetchApp.fetch(LINE_MESSAGE_REPLY_URL, replyMessageStructure(replytoken, replyText, type, items));
    } catch (error) {
        Logger.log(error.name + "：" + error.message);
        return;
    }

    if (response.getResponseCode() === 200) {
        Logger.log("[replyMessage()] Sending message completed.");
    }
}

function replyMessageStructure(replytoken, replyText, type, items = []) {

    let messages = null;
    switch (type) {
        case MESSAGE_TYPE.NORMAL:
            messages = normalReplyMessage(replyText);
            break;
        case MESSAGE_TYPE.QUICKREPLY:
            messages = quickReplyMessage(replyText, items);
            break;
        default:
            messages = normalReplyMessage(replyText);
            break;
    }


    var lineHeader = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + LINE_CHANEL_ACCESS_TOKEN
    };

    var postData = {
        "replyToken": replytoken,
        "messages": messages
    };

    var options = {
        "method": "POST",
        "headers": lineHeader,
        "payload": JSON.stringify(postData)
    };

    return options;
}

function normalReplyMessage(replyText) {
    let normalStructure = [{
        "type": "text",
        "text": replyText
    }];
    return normalStructure;
}

function quickReplyMessage(title, items) {
    let quickStructure = [{
        "type": "text",
        "text": title,
        "quickReply": {
            "items": items
        }
    }];

    return quickStructure;
}



export {
    sendLineNotify,
    replyMessage,
    MESSAGE_TYPE
};