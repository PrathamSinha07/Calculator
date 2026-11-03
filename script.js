
// ==========================================
// 1. SELECT HTML ELEMENTS
// ==========================================

const display = document.getElementById("result");

const buttons = document.querySelectorAll(".buttons button");

const historyList = document.getElementById("historyList");

const historyToggle = document.getElementById("historyToggle");

const historyPanel = document.getElementById("historyPanel");

const closeHistory = document.getElementById("closeHistory");

const clearHistory = document.getElementById("clearHistory");


// ==========================================
// 2. VARIABLES
// ==========================================

const STORAGE_KEY = "calculatorHistory";

const operators = ["+", "-", "*", "/"];

// Maximum number of characters allowed in an expression
const MAX_INPUT_LENGTH = 20;

let justCalculated = false;


// ==========================================
// 3. LOAD HISTORY FROM LOCAL STORAGE
// ==========================================

function loadHistory() {

    try {

        const savedHistory = JSON.parse(
            localStorage.getItem(STORAGE_KEY)
        );

        if (Array.isArray(savedHistory)) {
            return savedHistory.filter(entry =>
                entry &&
                typeof entry.expression === "string" &&
                typeof entry.result === "string"
            );
        }

        return [];

    }

    catch (error) {

        console.error("Unable to load history:", error);

        return [];

    }

}

let history = loadHistory();


// ==========================================
// 4. HISTORY PANEL
// ==========================================

// Open and close history
historyToggle.addEventListener("click", function () {

    historyPanel.hidden = !historyPanel.hidden;

});


// Close history
closeHistory.addEventListener("click", function () {

    historyPanel.hidden = true;

});


// Clear history
clearHistory.addEventListener("click", function () {

    history = [];

    localStorage.removeItem(STORAGE_KEY);

    renderHistory();

});


// ==========================================
// 5. SAVE HISTORY TO LOCAL STORAGE
// ==========================================

function saveHistory() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(history)
    );

}


// ==========================================
// 6. DISPLAY CALCULATION HISTORY
// ==========================================

function renderHistory() {

    historyList.innerHTML = "";

    history.forEach(function (entry) {

        const item = document.createElement("li");

        item.textContent =
            entry.expression + " = " + entry.result;

        historyList.prepend(item);

    });

}


// ==========================================
// 7. ADD NEW CALCULATION TO HISTORY
// ==========================================

function addToHistory(expression, result) {

    history.push({

        expression: expression,

        result: result

    });

    saveHistory();

    renderHistory();

}


// ==========================================
// 8. CALCULATE MATHEMATICAL EXPRESSION
// ==========================================

function calculate(expression) {

    try {

        if (expression.trim() === "") {
            return "Error";
        }

        const result = Function(
            '"use strict"; return (' + expression + ')'
        )();

        if (
            typeof result !== "number" ||
            !Number.isFinite(result)
        ) {

            return "Error";

        }

        return Number(result.toFixed(10)).toString();

    }

    catch (error) {

        return "Error";

    }

}


// ==========================================
// 9. BUTTON CLICK EVENTS
// ==========================================

buttons.forEach(function (button) {

    button.addEventListener("click", function () {

        let value = button.innerText.trim();

        // Multiplication symbol
        if (value === "×" || value.toLowerCase() === "x") {

            value = "*";

        }

        // Division symbol
        if (value === "÷") {

            value = "/";

        }

        handleInput(value);

    });

});


// ==========================================
// 10. MAIN CALCULATOR FUNCTION
// ==========================================

function handleInput(value) {

    let current = display.value;


    // CLEAR ALL
    if (value === "AC") {

        display.value = "";

        justCalculated = false;

        return;

    }


    // DELETE LAST CHARACTER
    if (value === "DEL") {

        if (current === "Error") {

            display.value = "";

        }

        else {

            display.value = current.slice(0, -1);

        }

        justCalculated = false;

        return;

    }


    // CALCULATE RESULT
    if (value === "=") {

        // Ignore repeated "=" so the same result
        // is never added to the history twice
        if (justCalculated) {

            return;

        }

        if (
            current.trim() === "" ||
            current === "Error"
        ) {

            return;

        }

        const result = calculate(current);

        if (result === "Error") {

            display.value = "Error";

            justCalculated = false;

            return;

        }

        // Save calculation
        addToHistory(current, result);

        // Display result
        display.value = result;

        justCalculated = true;

        return;

    }


    // RESET AFTER ERROR
    if (current === "Error") {

        display.value = "";

        current = "";

    }


    // HANDLE OPERATORS
    if (operators.includes(value)) {

        // Allow minus at the beginning
        if (current === "" && value !== "-") {

            return;

        }

        const lastChar = current.slice(-1);

        // Replace a trailing operator instead of stacking
        // two of them, which would create a malformed expression
        if (operators.includes(lastChar)) {

            if (current.length > 1) {

                display.value = current.slice(0, -1) + value;

            }

            return;

        }

        // Stop the expression from growing without a limit
        if (current.length >= MAX_INPUT_LENGTH) {

            return;

        }

        display.value += value;

        justCalculated = false;

        return;

    }


    // HANDLE DECIMAL
    if (value === ".") {

        // Start new expression after equals
        if (justCalculated) {

            display.value = "";

            current = "";

            justCalculated = false;

        }

        // Stop the expression from growing without a limit
        if (current.length >= MAX_INPUT_LENGTH) {

            return;

        }

        const parts = current.split(/[+\-*/]/);

        const lastNumber = parts[parts.length - 1];

        // Prevent multiple decimals
        if (lastNumber.includes(".")) {

            return;

        }

        // Add zero before decimal
        if (lastNumber === "") {

            display.value += "0";

        }

        display.value += ".";

        return;

    }


    // HANDLE NUMBERS
    if (/^[0-9]$/.test(value)) {

        // Start fresh after calculation
        if (justCalculated) {

            display.value = "";

            current = "";

            justCalculated = false;

        }

        // Stop the expression from growing without a limit
        if (current.length >= MAX_INPUT_LENGTH) {

            return;

        }

        const parts = current.split(/[+\-*/]/);

        const lastNumber = parts[parts.length - 1];

        // Replace a leading zero instead of building
        // invalid looking numbers such as "07"
        if (lastNumber === "0") {

            display.value = current.slice(0, -1);

            current = display.value;

        }

        display.value += value;

    }

}


// ==========================================
// 11. KEYBOARD SUPPORT
// ==========================================

document.addEventListener("keydown", function (event) {

    const key = event.key;


    // Numbers, operators and decimal
    if (

        /^[0-9]$/.test(key) ||

        operators.includes(key) ||

        key === "."

    ) {

        handleInput(key);

    }


    // Enter or equals
    else if (key === "Enter" || key === "=") {

        event.preventDefault();

        handleInput("=");

    }


    // Backspace
    else if (key === "Backspace") {

        event.preventDefault();

        handleInput("DEL");

    }


    // Escape
    else if (key === "Escape") {

        handleInput("AC");

    }

});


// ==========================================
// 12. INITIALIZE APPLICATION
// ==========================================

// Display previously saved history
renderHistory();
