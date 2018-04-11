
var objectToString = function(dataObject, pre, post, identation) {
    pre = pre || '';
    post = post || '';
    identation = identation || '';

    var lines = pre + identation + '{\n';
    Object.keys(dataObject).forEach(function (key) {
        lines += identation + "  '" + key + "' : '" + dataObject[key] + "', \n";
    });
    lines += identation + '}'+ post +'\n';
    return lines;
};

var jsonToString = function (jsonData) {
    var jsonString = '';
    var pre = '';
    var post = ',';
    var identation = '  '

    if (jsonData instanceof Array) {
        jsonString += '[\n';
        jsonData.forEach(function(arrayItem) {
            jsonString += objectToString(arrayItem, pre, post, identation);
        });
        jsonString += ']\n'
    } else if (jsonData instanceof Object) {
        jsonString = objectToString(jsonData);
    }
    return jsonString;
};

module.exports = {
    objectToString: objectToString,
    jsonToString: jsonToString
}