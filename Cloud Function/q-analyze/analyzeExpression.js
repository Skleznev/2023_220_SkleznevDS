const isBoolean = require('lodash.isboolean');
const isNumber = require('lodash.isnumber');
const isString = require('lodash.isstring');
const isPlainObject = require('lodash.isplainobject');
const isArray = require('lodash.isarray');

function analyzeExpressionArray(data, tempResult) {
    for (const item of data) {
        analyzeExpressionUnknown(item, tempResult);
    }
    return false;
}
function analyzeExpressionObject(data, tempResult) {
    const lowerCasedDataKeys = Object.keys(data).map((key) => key.toLowerCase());
    let dataKeysForAnalyze = [];
    let indentLevel = 0;
    if (lowerCasedDataKeys.includes("c") &&
        lowerCasedDataKeys.includes("v") &&
        lowerCasedDataKeys.length === 2) {
        // conditional
        dataKeysForAnalyze = ["c", "v"];
    }
    else if (lowerCasedDataKeys.includes("op") &&
        lowerCasedDataKeys.includes("fo") &&
        lowerCasedDataKeys.includes("so") &&
        lowerCasedDataKeys.length === 3) {
        // binary
        dataKeysForAnalyze = ["fo", "so"];
        indentLevel = 1;
    }
    else if (lowerCasedDataKeys.includes("op") &&
        lowerCasedDataKeys.includes("od") &&
        lowerCasedDataKeys.length === 2) {
        // unary
        dataKeysForAnalyze = ["od"];
        indentLevel = 1;
    }
    else if ((lowerCasedDataKeys.includes("v") || lowerCasedDataKeys.includes("n")) &&
        lowerCasedDataKeys.length === 1) {
        // number and variable
        return true;
    }
    else {
        return null;
    }
    let isFinal = true;
    tempResult.ticks += indentLevel;
    Object.entries(data)
        .filter(([key]) => dataKeysForAnalyze.includes(key.toLowerCase()))
        .map(([key, value]) => {
            const isChildFinal = analyzeExpressionUnknown(value, tempResult);
            if (!isChildFinal) {
                isFinal = false;
            }
        });
    if (isFinal) {
        tempResult.processors++;
        tempResult.maxTicks = Math.max(tempResult.ticks, tempResult.maxTicks);
    }
    tempResult.ticks -= indentLevel;
    return false;
}
function analyzeExpressionUnknown(data, tempResult) {
    if (isArray(data)) {
        return analyzeExpressionArray(data, tempResult);
    }
    else if (isPlainObject(data)) {
        return analyzeExpressionObject(data, tempResult);
    }
    else if (isString(data) || isNumber(data) || isBoolean(data)) {
        return true;
    }
    else {
        return null;
    }
}
module.exports = function analyzeExpression(data) {
    const tempResult = {
        maxTicks: 0,
        processors: 0,
        ticks: 0,
    };
    analyzeExpressionUnknown(data, tempResult);
    return {
        processors: tempResult.processors,
        ticks: tempResult.maxTicks,
    };
}