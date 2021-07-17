(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var calculator_1 = require("@known-as-dan/calculator");
var calculator_2 = require("@known-as-dan/calculator");
var calculator_3 = require("@known-as-dan/calculator");
var ID = {
    MAIN_BODY: "main",
    CALCULATOR_DIV: "calculator",
    MATH_INPUT: "math_input",
    RESULT_DIV: "result",
    THEME_SELECT: "theme",
    OPERATOR_LIST: "operators",
    FUNCTION_LIST: "functions",
    CONSTANT_LIST: "constants"
};
function calculateInput() {
    var MATH_INPUT = document.getElementById(ID.MATH_INPUT);
    var math_input_content = MATH_INPUT.value;
    var start_parse = window.performance.now(); // start parse
    var parse_result = calculator_1.parse(math_input_content);
    var end_parse = window.performance.now(); // end parse | start calc
    var solution = calculator_1.calculate(parse_result);
    var end_calc = window.performance.now(); // end calc
    var parse_time = end_parse - start_parse;
    var calc_time = end_calc - end_parse;
    var fmt = "result:\t" + solution + "\nparse:\t" + (parse_time).toFixed(3) + " milliseconds\ncalc:\t" + (calc_time).toFixed(3) + " milliseconds";
    var result_div = document.getElementById(ID.RESULT_DIV);
    if (result_div) {
        result_div.textContent = fmt;
    }
}
function updateTheme() {
    // get theme setting from localStorage("light" is default)
    var theme = localStorage.getItem("theme") || "Light";
    // edit main html body accordingly
    var body = document.getElementById(ID.MAIN_BODY);
    if (theme === "Light") {
        body.style.backgroundColor = "white";
        body.style.color = "black";
        body.style.caretColor = "black";
    }
    else {
        body.style.backgroundColor = "#222";
        body.style.color = "white";
        body.style.caretColor = "white";
    }
    // set dropdown menu to the current theme setting
    var select = document.getElementById(ID.THEME_SELECT);
    select.value = theme;
}
function updateInfo() {
    var operator_div = document.getElementById(ID.OPERATOR_LIST);
    if (operator_div) {
        var operators = calculator_1.getOperators();
        var operator = void 0;
        var fmt = void 0;
        for (var i = 0; i < operators.length; i++) {
            operator = operators[i];
            fmt = "<b>" + operator.name + ":</b> <code>" + operator.usage + "</code><br>";
            operator_div.innerHTML += fmt;
        }
    }
    var func_div = document.getElementById(ID.FUNCTION_LIST);
    if (func_div) {
        var functions = calculator_2.getFunctions();
        var func = void 0;
        var fmt = void 0;
        for (var i = 0; i < functions.length; i++) {
            func = functions[i];
            fmt = "<b>" + func.name + ":</b> <code>" + func.usage + "</code><br>";
            func_div.innerHTML += fmt;
        }
    }
    var constant_div = document.getElementById(ID.CONSTANT_LIST);
    if (constant_div) {
        var constants = calculator_3.getConstants();
        var constant = void 0;
        var fmt = void 0;
        for (var i = 0; i < constants.length; i++) {
            constant = constants[i];
            fmt = "<b>" + constant.identifier + " =></b> <code>" + constant.value + " </code><br>";
            constant_div.innerHTML += fmt;
        }
    }
}
function main() {
    updateTheme();
    updateInfo();
    // calculate input whenever you type anything(live calculation)
    $(document).on("keyup", "#" + ID.MATH_INPUT, function (event) {
        calculateInput();
    });
    // save theme setting to HTML5 Web Storage and update the theme
    $(document).on("change", "#" + ID.THEME_SELECT, function (event) {
        var select = event.target;
        var theme = select.value;
        localStorage.setItem("theme", theme);
        updateTheme();
    });
}
window.onload = main;

},{"@known-as-dan/calculator":5}],2:[function(require,module,exports){
"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var operators_1 = require("./operators");
var functions_1 = require("./functions");
var constants_1 = require("./constants");
function charIsNumber(char) {
    if ("0" <= char && char <= "9") {
        return true;
    }
    else {
        return false;
    }
}
function charIsLetter(char) {
    var letter_regex = /\w(?<!\d)/g; // finds letters in a string
    return letter_regex.test(char);
}
function charIsSymbol(char) {
    var symbol_regex = /\W(?<!\s)/g; // finds symbols in a string
    return symbol_regex.test(char);
}
function charIsWhitespace(char) {
    var whitespace_regex = /\s/g; // finds whitespace in a string
    return whitespace_regex.test(char);
}
/**
 * Allows you to find the index of the closing character when parsing
 * a string with something like parantheses where you might want to nest
 * them within each other
 * - Return format => Array<number> = [opening_char_index, closing_char_index]
 * - Returns -1 if a value wasn't found, so if the opening char wasn't found => [-1, closing_char_index]
 * @param open opening character
 * @param close closing character
 * @param start index to start the search at
 * @param end index to end the search at
 * @param str string to analyze
 */
function findClosingCharacter(open, close, start, end, str) {
    var char;
    var nesting_level = 0;
    var opening_char_index = -1;
    var closing_char_index = -1;
    for (var i = start; i <= end; i++) {
        char = str[i];
        if (char == open) {
            nesting_level++;
            if (nesting_level == 1) {
                opening_char_index = i;
            }
        }
        else if (char == close) {
            nesting_level--;
            if (nesting_level == 0) {
                closing_char_index = i;
                break;
            }
        }
    }
    return [opening_char_index, closing_char_index];
}
function conditionalReturn(condition, true_, false_) {
    if (condition) {
        return true_;
    }
    else {
        return false_;
    }
}
function parse(str, start, end) {
    start = start || 0;
    end = end || (str.length - 1);
    var parsed_str_array = [];
    var char;
    var enclosure_data;
    var closing_char_index;
    var buffer = "";
    var buffer_type = "none";
    for (var i = start; i <= end; i++) {
        char = str[i];
        if (start == 18) {
            console.log(char);
        }
        if (charIsWhitespace(char)) {
            continue;
        }
        else if (charIsNumber(char) || char == ".") {
            if (buffer_type == "word") {
                parsed_str_array.push(buffer);
                buffer = "";
            }
            buffer += char;
            buffer_type = "number";
        }
        else if (charIsSymbol(char)) {
            if (buffer_type == "word") {
                parsed_str_array.push(buffer);
                buffer = "";
                buffer_type = "none";
            }
            else if (buffer_type == "number") {
                parsed_str_array.push(Number(buffer));
                buffer = "";
                buffer_type = "none";
            }
            if (char == "(") {
                enclosure_data = findClosingCharacter("(", ")", i, end, str);
                closing_char_index = conditionalReturn(enclosure_data[1] >= 0, enclosure_data[1], end + 1);
                parsed_str_array.push(parse(str, i + 1, closing_char_index - 1));
                i = closing_char_index;
            }
            else if (char == ",") {
                if (buffer_type == "word") {
                    parsed_str_array.push(buffer);
                    buffer = "";
                    buffer_type = "none";
                }
                else if (buffer_type == "number") {
                    parsed_str_array.push(Number(buffer));
                    buffer = "";
                    buffer_type = "none";
                }
            }
            else {
                parsed_str_array.push(char);
            }
        }
        else if (charIsLetter(char)) {
            if (buffer_type == "number") {
                parsed_str_array.push(Number(buffer));
                buffer = "";
            }
            buffer += char;
            buffer_type = "word";
        }
        if (i == end) {
            if (buffer_type == "word") {
                parsed_str_array.push(buffer);
            }
            else if (buffer_type == "number") {
                parsed_str_array.push(Number(buffer));
            }
        }
    }
    return parsed_str_array;
}
exports.parse = parse;
function calculate(math) {
    math = __spreadArrays(math);
    var value;
    var constant;
    for (var i = 0; i < math.length; i++) {
        value = math[i];
        constant = constants_1.getConstant(value);
        if (constant) {
            math[i] = constant.value;
        }
    }
    var result;
    for (var i = 0; i < math.length; i++) {
        value = math[i];
        if (Array.isArray(value)) {
            result = calculate(value);
            if (functions_1.getFunction(math[i - 1])) {
                math[i] = result;
            }
            else {
                math[i] = result[0];
            }
        }
    }
    var func;
    for (var i = 0; i < math.length; i++) {
        value = math[i];
        if (typeof value == "number" || Array.isArray(value)) {
            continue;
        }
        func = functions_1.getFunction(value);
        if (func) {
            result = func.func(conditionalReturn(Array.isArray(math[i + 1]), math[i + 1], []));
            if (Array.isArray(math[i + 1])) {
                math[i] = result;
                math.splice(i + 1, 1);
            }
            else {
                math.splice(i, 1);
            }
        }
    }
    var operator;
    var priority_list = [];
    for (var i = math.length - 1; i >= 0; i--) {
        value = math[i];
        if (typeof value == "number" || Array.isArray(value)) {
            continue;
        }
        operator = operators_1.getOperator(value);
        if (operator) {
            priority_list[operator.priority] = true;
        }
    }
    for (var k = priority_list.length - 1; k >= 0; k--) {
        if (priority_list[k]) {
            for (var i = 0; i < math.length; i++) {
                value = math[i];
                if (typeof value == "number" || Array.isArray(value)) {
                    continue;
                }
                operator = operators_1.getOperator(value);
                if (operator && operator.priority == k) {
                    result = operator.func(conditionalReturn(typeof math[i - 1] == "number", math[i - 1], 0), conditionalReturn(typeof math[i + 1] == "number", math[i + 1], 0));
                    if ((typeof math[i - 1] == "number") && (typeof math[i + 1] == "number")) {
                        math[i - 1] = result;
                        math.splice(i, 2);
                        i--;
                    }
                    else if (typeof math[i - 1] == "number") {
                        math[i - 1] = result;
                        math.splice(i, 1);
                        i--;
                    }
                    else if (typeof math[i + 1] == "number") {
                        math[i] = result;
                        math.splice(i + 1, 1);
                    }
                    else {
                        math.splice(i, 1);
                    }
                }
            }
        }
    }
    return math;
}
exports.calculate = calculate;

},{"./constants":3,"./functions":4,"./operators":6}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants = [];
function getConstants() {
    return constants;
}
exports.getConstants = getConstants;
function addConstant(name, identifier, value) {
    constants.push({
        name: name,
        identifier: identifier,
        value: value
    });
}
exports.addConstant = addConstant;
function getConstant(identifier) {
    var constant_list = getConstants();
    var constant;
    for (var i = 0; i < constant_list.length; i++) {
        constant = constant_list[i];
        if (constant.identifier == identifier) {
            return constant;
        }
    }
    return null;
}
exports.getConstant = getConstant;
addConstant("Pie", "PI", Math.PI);
addConstant("Euler's number", "e", 2.71828182846);
addConstant("Zero", "Zero", 0);
addConstant("One", "One", 1);

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var functions = [];
function getFunctions() {
    return functions;
}
exports.getFunctions = getFunctions;
function addFunction(name, identifier, usage, func) {
    functions.push({
        name: name,
        identifier: identifier,
        usage: usage,
        func: func
    });
}
exports.addFunction = addFunction;
function getFunction(identifier) {
    var func_list = getFunctions();
    var func;
    for (var i = 0; i < func_list.length; i++) {
        func = func_list[i];
        if (func.identifier == identifier) {
            return func;
        }
    }
    return null;
}
exports.getFunction = getFunction;
function fetchValue(arr, index) {
    if (typeof arr[index] == "number") {
        return arr[index];
    }
    else {
        return 0;
    }
}
exports.fetchValue = fetchValue;
addFunction("Absolute", "abs", "abs(num)", function (values) {
    var num = fetchValue(values, 0);
    return Math.abs(num);
});
addFunction("Square Root", "sqrt", "sqrt(num)", function (values) {
    var num = fetchValue(values, 0);
    return Math.sqrt(num);
});
addFunction("Cosine", "cos", "cos(degrees)", function (values) {
    var num = fetchValue(values, 0);
    return Math.cos(num * (Math.PI / 180));
});
addFunction("Sine", "sin", "sin(degrees)", function (values) {
    var num = fetchValue(values, 0);
    return Math.sin(num * (Math.PI / 180));
});
addFunction("Tangent", "tan", "tan(degrees)", function (values) {
    var num = fetchValue(values, 0);
    return Math.tan(num * (Math.PI / 180));
});
addFunction("Reverse Cosine", "acos", "acos(num)", function (values) {
    var num = fetchValue(values, 0);
    return Math.acos(num) * (180 / Math.PI);
});
addFunction("Reverse Sine", "asin", "asin(num)", function (values) {
    var num = fetchValue(values, 0);
    return Math.asin(num) * (180 / Math.PI);
});
addFunction("Reverse Tangent", "atan", "atan(num)", function (values) {
    var num = fetchValue(values, 0);
    return Math.atan(num) * (180 / Math.PI);
});
addFunction("Round", "round", "round(num)", function (values) {
    var num = fetchValue(values, 0);
    return Math.round(num);
});
addFunction("Floor", "floor", "floor(num)", function (values) {
    var num = fetchValue(values, 0);
    return Math.floor(num);
});
addFunction("Ceiling", "ceil", "ceil(num)", function (values) {
    var num = fetchValue(values, 0);
    return Math.ceil(num);
});
addFunction("Random", "rand", "rand(min, max)", function (values) {
    var min = fetchValue(values, 0);
    var max = fetchValue(values, 1);
    return Math.floor(Math.random() * (max - min)) + min;
});
addFunction("Fixed Decimal Places", "toFixed", "toFixed(min, max)", function (values) {
    var num = fetchValue(values, 0);
    var decimal_places = fetchValue(values, 1);
    return Number(num.toFixed(decimal_places));
});

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var calculator_1 = require("./calculator");
exports.parse = calculator_1.parse;
exports.calculate = calculator_1.calculate;
var functions_1 = require("./functions");
exports.addFunction = functions_1.addFunction;
exports.fetchValue = functions_1.fetchValue;
exports.getFunctions = functions_1.getFunctions;
var operators_1 = require("./operators");
exports.addOperator = operators_1.addOperator;
exports.getOperators = operators_1.getOperators;
var constants_1 = require("./constants");
exports.addConstant = constants_1.addConstant;
exports.getConstants = constants_1.getConstants;

},{"./calculator":2,"./constants":3,"./functions":4,"./operators":6}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var operators = [];
function getOperators() {
    return operators;
}
exports.getOperators = getOperators;
function addOperator(name, identifying_symbol, usage, priority, func) {
    operators.push({
        name: name,
        identifying_symbol: identifying_symbol,
        usage: usage,
        priority: priority,
        func: func
    });
}
exports.addOperator = addOperator;
function getOperator(identifying_symbol) {
    var operator_list = getOperators();
    var operator;
    for (var i = 0; i < operator_list.length; i++) {
        operator = operator_list[i];
        if (operator.identifying_symbol == identifying_symbol) {
            return operator;
        }
    }
    return null;
}
exports.getOperator = getOperator;
addOperator("Addition", "+", "A + B", 0, function (a, b) {
    return a + b;
});
addOperator("Subtraction", "-", "A - B", 0, function (a, b) {
    return a - b;
});
addOperator("Multiplication", "*", "A * B", 1, function (a, b) {
    return a * b;
});
addOperator("Division", "/", "A / B", 1, function (a, b) {
    return a / b;
});
addOperator("Power", "^", "A ^ B", 1, function (a, b) {
    return Math.pow(a, b);
});

},{}]},{},[1]);
