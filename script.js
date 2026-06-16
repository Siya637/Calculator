const num1Input = document.getElementById('num1');
const num2Input = document.getElementById('num2');
const resultEl = document.getElementById('result');
const opButtons = document.querySelectorAll('.operations button');
const themeToggle = document.getElementById('theme-toggle');
const historyList = document.getElementById('history-list');
const clearHistoryBtn = document.getElementById('clear-history');

const opSymbols = {
  '+': '+',
  '-': '−',
  '*': '×',
  '/': '÷'
};

let history = [];

function showResult(value, isError = false) {
  resultEl.classList.remove('show');
  resultEl.textContent = value;
  resultEl.classList.toggle('error', isError);
  // Restart animation
  void resultEl.offsetWidth;
  resultEl.classList.add('show');
}

function setInputError(input, hasError) {
  input.classList.toggle('error', hasError);
}

function clearInputErrors() {
  setInputError(num1Input, false);
  setInputError(num2Input, false);
}

function renderHistory() {
  historyList.innerHTML = '';

  if (history.length === 0) {
    const empty = document.createElement('li');
    empty.classList.add('history-empty');
    empty.textContent = 'No calculations yet';
    historyList.appendChild(empty);
    return;
  }

  history.forEach(entry => {
    const li = document.createElement('li');
    li.textContent = `${entry.num1} ${opSymbols[entry.op]} ${entry.num2} = ${entry.result}`;
    historyList.appendChild(li);
  });
}

function addToHistory(num1, op, num2, result) {
  history.unshift({ num1, op, num2, result });
  if (history.length > 10) {
    history.pop();
  }
  renderHistory();
}

function calculate(operator) {
  const raw1 = num1Input.value.trim();
  const raw2 = num2Input.value.trim();

  clearInputErrors();

  // Empty input check
  if (raw1 === '' || raw2 === '') {
    setInputError(num1Input, raw1 === '');
    setInputError(num2Input, raw2 === '');
    showResult('Please enter both numbers', true);
    return;
  }

  const num1 = Number(raw1);
  const num2 = Number(raw2);

  // Valid number check
  if (isNaN(num1) || isNaN(num2)) {
    setInputError(num1Input, isNaN(num1));
    setInputError(num2Input, isNaN(num2));
    showResult('Please enter valid numbers', true);
    return;
  }

  let result;

  switch (operator) {
    case '+':
      result = num1 + num2;
      break;
    case '-':
      result = num1 - num2;
      break;
    case '*':
      result = num1 * num2;
      break;
    case '/':
      if (num2 === 0) {
        setInputError(num2Input, true);
        showResult('Cannot divide by zero', true);
        return;
      }
      result = num1 / num2;
      break;
    default:
      showResult('Invalid operation', true);
      return;
  }

  // Round long decimals
  if (typeof result === 'number' && !Number.isInteger(result)) {
    result = Math.round(result * 1e8) / 1e8;
  }

  showResult(result);
  addToHistory(num1, operator, num2, result);
}

opButtons.forEach(button => {
  button.addEventListener('click', () => {
    calculate(button.dataset.op);
  });
});

// Theme toggle
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  themeToggle.textContent = document.body.classList.contains('dark') ? '☀' : '☾';
});

// Clear history
clearHistoryBtn.addEventListener('click', () => {
  history = [];
  renderHistory();
});

// Keyboard support
document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case '+':
      calculate('+');
      break;
    case '-':
      calculate('-');
      break;
    case '*':
      calculate('*');
      break;
    case '/':
      e.preventDefault();
      calculate('/');
      break;
    case 'Enter':
      calculate('+');
      break;
  }
});

// Initial render
renderHistory();