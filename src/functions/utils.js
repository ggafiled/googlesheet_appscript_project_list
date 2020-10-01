/*- getDataFromRange: This function 3 argument requried (sheet : sheet name, range : range data in sheet wanna store data, 
value : the value you wanna to store in sheet). It's not return.-*/
const setDataToStore = (range, value) => {
    SpreadsheetApp.getActive().getSheetByName("StoreData").getRange(range).setValue(value);
}

/*- getDataFromRange: This function 2 argument requried (sheet : sheet name, range : range data in sheet wanna get it). It's will return range data.-*/
const getDataFromRange = (sheetname, range) => {
    return SpreadsheetApp.getActive().getSheetByName(sheetname).getRange(range).getValue();
}

/*- isEmpty: This function 1 argument requried (text : that wanna check is emtry or null). It's will return True or False.-*/
const isEmpty = (text) => {
    return text === '' ? true : false;
}

const filterByValue = (string) => {
    Logger.log("[filterByValue()]: starting function.");
    const Progress = Tamotsu.Table.define({
        sheetName: 'Progress',
        rowShift: 1,
        columnShift: 0,
    });
    if (string) {
        var finalarray = Progress.where((row) => {
            String(row[1]).trim() !== ""
        }).all().filter(o =>
            Object.keys(o).some(k => String(o[k]).toLowerCase().includes(string.toLowerCase())))
    } else {
        var finalarray = Progress.where((row) => {
            return String(row["Project"]).trim() !== ''
        }).all();
    }

    Logger.log("[filterByValue()]" + JSON.stringify(finalarray));
    return JSON.stringify(finalarray);
}

const render = (file, argsObject) => {
    var tmp = HtmlService.createTemplateFromFile(file);
    if (argsObject) {
        var keys = Object.keys(argsObject);
        keys.forEach(function(key) {
            tmp[key] = argsObject[key];
        });
    }
    return tmp.evaluate().setTitle("- 🕵️‍♀️ Project List -").setFaviconUrl("https://scontent.fbkk22-4.fna.fbcdn.net/v/t1.0-9/120255176_3346579338756362_2357071726779952401_n.jpg?_nc_cat=111&_nc_sid=dbeb18&_nc_eui2=AeEVUb-0d4LcisMTO3aDozERMgFIZlpIi6UyAUhmWkiLpXOFSv04EFE4O9b02ZE2F9z0OztD2vxWCg_TBxbA5jSB&_nc_ohc=b5zUwSjAKY8AX_P1gN7&_nc_ht=scontent.fbkk22-4.fna&oh=1aee43c61c82b9423c691363354159db&oe=5F9BAD44");
}

export {
    setDataToStore,
    getDataFromRange,
    isEmpty,
    filterByValue,
    render
};