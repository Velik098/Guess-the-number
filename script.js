const playerNameInput = document.getElementById('playerName');
const guessInput = document.getElementById('guessInput');
const checkButton = document.getElementById('checkButton');
const newGameButton = document.getElementById('newGameButton');
const clearRecordsButton = document.getElementById('clearRecordsButton');
const messageBlock = document.getElementById('message');
const attemptsCount = document.getElementById('attemptsCount');
const recordsBody = document.getElementById('recordsBody');

const recordsKey = 'guessNumberRecords';

let secretNumber = 0;
let attempts = 0;
let gameFinished = false;
let currentPlayer = '';

function getRandomNumber() {
    return Math.floor(Math.random() * 100) + 1;
}

function showMessage(text, type) {
    messageBlock.textContent = text;
    messageBlock.className = 'message';

    if (type) {
        messageBlock.classList.add(type);
    }
}

function validateInput() {
    const name = playerNameInput.value.trim();
    const guessText = guessInput.value.trim();

    if (name === '') {
        return 'Введите имя игрока.';
    }

    if (guessText === '') {
        return 'Введите число.';
    }

    const guess = Number(guessText);

    if (isNaN(guess)) {
        return 'Введите число, а не текст.';
    }

    if (!Number.isInteger(guess)) {
        return 'Введите целое число.';
    }

    if (guess < 1 || guess > 100) {
        return 'Число должно быть от 1 до 100.';
    }

    return '';
}

function handleAnswer() {
    if (gameFinished) {
        showMessage('Игра уже завершена. Нажмите "Новая игра".', 'error');
        return;
    } 
 

    const error = validateInput();

    if (error !== '') {
        showMessage(error, 'error');
        return;
    }
 
    currentPlayer = playerNameInput.value.trim();
    playerNameInput.disabled = true;
 
    const guess = Number(guessInput.value.trim());
    attempts++;
    attemptsCount.textContent = attempts;

    if (guess < secretNumber) {
        showMessage('Загаданное число больше.', '');
    } else if (guess > secretNumber) {
        showMessage('Загаданное число меньше.', '');
    } else {
        gameFinished = true;
        checkButton.disabled = true;
        showMessage('Вы угадали! Результат сохранён в таблицу рекордов.', 'success');
        saveRecord(currentPlayer, attempts);
        renderRecords();
    }

    guessInput.value = '';
    guessInput.focus();
}

function loadRecords() {
    const recordsText = localStorage.getItem(recordsKey);

    if (recordsText === null) {
        return [];
    }

    try {
        return JSON.parse(recordsText);
    } catch (error) {
        return [];
    }
}

function saveRecords(records) {
    localStorage.setItem(recordsKey, JSON.stringify(records));
}

function saveRecord(name, attemptsCountValue) {
    const records = loadRecords();
    const newRecord = {
        name: name,
        attempts: attemptsCountValue,
        date: new Date().toLocaleDateString('ru-RU')
    };

    records.push(newRecord);
    records.sort(function(a, b) {
        return a.attempts - b.attempts;
    });

    saveRecords(records.slice(0, 10));
}

function renderRecords() {
    const records = loadRecords();
    recordsBody.innerHTML = '';

    if (records.length === 0) {
        recordsBody.innerHTML = '<tr><td colspan="4">Рекордов пока нет</td></tr>';
        return;
    }

    records.forEach(function(record, index) {
        const row = document.createElement('tr');
        const placeCell = document.createElement('td');
        const nameCell = document.createElement('td');
        const attemptsCell = document.createElement('td');
        const dateCell = document.createElement('td');

        placeCell.textContent = index + 1;
        nameCell.textContent = record.name;
        attemptsCell.textContent = record.attempts;
        dateCell.textContent = record.date;

        row.appendChild(placeCell);
        row.appendChild(nameCell);
        row.appendChild(attemptsCell);
        row.appendChild(dateCell);
        recordsBody.appendChild(row);
    });
}

function startNewGame() {
    secretNumber = getRandomNumber();
    attempts = 0;
    gameFinished = false;
    currentPlayer = '';

    attemptsCount.textContent = attempts;
    guessInput.value = '';
    playerNameInput.value = '';
    playerNameInput.disabled = false;
    checkButton.disabled = false;

    showMessage('Новая игра началась. Введите имя и число.', '');
    playerNameInput.focus();
}

function clearRecords() {
    localStorage.removeItem(recordsKey);
    renderRecords();
}

checkButton.addEventListener('click', handleAnswer);
newGameButton.addEventListener('click', startNewGame);
clearRecordsButton.addEventListener('click', clearRecords);

guessInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        handleAnswer();
    }
});

playerNameInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        guessInput.focus();
    }
});

startNewGame();
renderRecords();
