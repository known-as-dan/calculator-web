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
