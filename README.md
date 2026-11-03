# JavaScript Calculator

A modern, responsive calculator built with HTML, CSS, and Vanilla JavaScript — no frameworks, no build step, no external dependencies.

## Features

- Basic arithmetic: addition, subtraction, multiplication, division
- Decimal calculations with floating-point rounding protection
- AC (clear all) and DEL (delete last character) buttons
- Safe arithmetic expression evaluator with operator precedence
  - Replaces `eval()` / `Function()` with a hand-written tokenizer and recursive-descent parser
  - Supports parentheses, unary minus, and negative numbers
  - Division by zero and malformed expressions return `Error` instead of crashing
- Input validation: prevents stacked operators, duplicate decimals, leading zeros, and runaway input length
- Keyboard support (see shortcuts below), with visual feedback on the matching button
- Calculation history panel (in-memory only — nothing is stored in LocalStorage)
  - Most recent calculation shown first, capped at 30 entries
  - Click an entry to reuse its result
  - Clear history button (disabled when the history is empty)
- Accessible interface: labelled controls, `aria-live` display, `aria-expanded` history toggle, visible focus rings
- Responsive layout for phones, tablets, and desktops, with `prefers-reduced-motion` support

## Tech Stack

- HTML5
- CSS3 (Flexbox, CSS Grid, media queries)
- JavaScript (Vanilla JS)

## Project Structure

```text
Calculator/
├── index.html      # Markup: display, button grid, history panel
├── style.css       # Dark theme, orange operators, responsive rules
├── script.js       # Input handling, safe evaluator, keyboard, history
├── README.md
└── .gitignore
```

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/PrathamSinha07/Calculator.git
   cd Calculator
   ```

2. Open `index.html` directly in a browser, **or** serve the folder with any static server (for example the VS Code **Live Server** extension):

   ```bash
   npx serve .
   ```

No installation or build step is required.

## Keyboard Shortcuts

| Key | Action |
|---|---|
| `0`–`9` | Enter numbers |
| `+` `-` `*` `/` or `x` | Arithmetic operators |
| `.` | Decimal point |
| `Enter` or `=` | Calculate result |
| `Backspace` | Delete last character |
| `Escape` | Clear all (AC) |

Keyboard and button input share the same code path, so both behave identically.

## How It Works

`script.js` is organised in labelled sections:

1. **Element selection** — grabs the display, buttons, and history panel
2. **Variables** — operators, input length limit, history cap
3. **History storage** — a plain in-memory array (no LocalStorage)
4. **History panel** — open, close, and clear handlers
5. **Rendering** — builds the history list with reusable entry buttons
6. **Adding entries** — deduplicates and trims history to 30 entries
7. **Safe evaluation** — tokenizer → recursive-descent parser with correct precedence
8. **Input handling** — validation for numbers, operators, decimals, AC, and DEL
9. **Keyboard support** — maps keys to the same input handler
10. **Initialisation** — renders the empty history state

Input flows through one shared `handleInput()` function, which is why buttons and keyboard shortcuts behave identically.

## Learning Outcomes

This project helped me practice:

- DOM manipulation and event handling
- Writing a tokenizer and recursive-descent parser (operator precedence, unary minus)
- Defensive input validation and error handling
- CSS Grid, Flexbox, and responsive media queries
- Accessibility basics: ARIA attributes and focus management
- Keyboard event handling

## Author

Pratham Sinha

[GitHub](https://github.com/PrathamSinha07)

---

*Built as a hands-on project to strengthen frontend development fundamentals.*
