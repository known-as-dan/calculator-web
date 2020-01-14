import { parse, calculate, getOperators, MathOperator } from "@known-as-dan/calculator";
import { getFunctions, MathFunction } from "@known-as-dan/calculator";
import { getConstants, MathConstant } from "@known-as-dan/calculator";

const ID: any = {
	MAIN_BODY: "main",
	CALCULATOR_DIV: "calculator",
	MATH_INPUT: "math_input",
	RESULT_DIV: "result",
	THEME_SELECT: "theme",
	OPERATOR_LIST: "operators",
	FUNCTION_LIST: "functions",
	CONSTANT_LIST: "constants"
}

function calculateInput(): void {
	const MATH_INPUT: any = document.getElementById(ID.MATH_INPUT);
	const math_input_content: string = MATH_INPUT.value;

	const start_parse: number = window.performance.now(); // start parse
	const parse_result: Array<any> = parse(math_input_content);
	const end_parse: number = window.performance.now(); // end parse | start calc
	const solution: any = calculate(parse_result);
	const end_calc: number = window.performance.now(); // end calc

	const parse_time: number = end_parse - start_parse;
	const calc_time: number = end_calc - end_parse; 

	const fmt: string = `result:	${solution}\nparse:	${(parse_time).toFixed(3)} milliseconds\ncalc:	${(calc_time).toFixed(3)} milliseconds`

	let result_div: Element | null = document.getElementById(ID.RESULT_DIV);
	if (result_div) {
		result_div.textContent = fmt;
	}
}

function updateTheme() {
	// get theme setting from localStorage("light" is default)
	const theme: string = localStorage.getItem("theme") || "Light";
	
	// edit main html body accordingly
	let body: any = document.getElementById(ID.MAIN_BODY);
    if (theme === "Light") {
        body.style.backgroundColor = "white";
        body.style.color = "black";
        body.style.caretColor = "black";
    } else {
        body.style.backgroundColor = "#222";
        body.style.color = "white";
		body.style.caretColor = "white";
	}
	// set dropdown menu to the current theme setting
	let select: any = document.getElementById(ID.THEME_SELECT);
	select.value = theme;
}

function updateInfo() {
	const operator_div = document.getElementById(ID.OPERATOR_LIST);
	if (operator_div) {
		const operators = getOperators();
		let operator: MathOperator;
		let fmt: string;
		for (let i = 0; i < operators.length; i++) {
			operator = operators[i];
			fmt = `<b>${operator.name}:</b> <code>${operator.usage}</code><br>`;
			operator_div.innerHTML += fmt;
		}
	}

	const func_div = document.getElementById(ID.FUNCTION_LIST);
	if (func_div) {
		const functions = getFunctions();
		let func: MathFunction;
		let fmt: string;
		for (let i = 0; i < functions.length; i++) {
			func = functions[i];
			fmt = `<b>${func.name}:</b> <code>${func.usage}</code><br>`;
			func_div.innerHTML += fmt;
		}
	}

	const constant_div = document.getElementById(ID.CONSTANT_LIST);
	if (constant_div) {
		const constants = getConstants();
		let constant: MathConstant;
		let fmt: string;
		for (let i = 0; i < constants.length; i++) {
			constant = constants[i];
			fmt = `<b>${constant.identifier} =></b> <code>${constant.value} </code>`;
			constant_div.innerHTML += fmt;
		}
	}
}

function main() {
	updateTheme();
	updateInfo()

	// calculate input whenever you type anything(live calculation)
	$(document).on("keyup", `#${ID.MATH_INPUT}`, (event): void => {
		calculateInput();
	});

	// save theme setting to HTML5 Web Storage and update the theme
	$(document).on("change", `#${ID.THEME_SELECT}`, (event): void => {
		const select: any = event.target;
		const theme: string = select.value;
		localStorage.setItem("theme", theme);
		updateTheme();
	});
}
window.onload = main;