// Select all card elements
const cards = document.querySelectorAll('.card');

// Initialize game state variables
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let moves = 0;
let seconds = 0;
let minutes = 0;
let interval;

// Function to flip a card
function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    // Start timer if it's the first move
    if (!hasFlippedCard && moves === 0) {
        startTimer();
    }

    this.classList.toggle('flip');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }
    secondCard = this;
    checkForMatch();
}

// Function to check if two cards match
function checkForMatch() {
    let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
    isMatch ? disableCards() : unflipCards();
}

// Function to disable matched cards
function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();

    // Check if all cards have been matched
    if (document.querySelectorAll('.card.flip').length === cards.length) {
        clearInterval(interval);
        showCongratsMessage();
    }
}

// Function to unflip non-matched cards
function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1500);
}

// Function to reset the game board
function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
    moves++;
    document.getElementById('moves').textContent = moves;
}

// Function to start the timer
function startTimer() {
    interval = setInterval(() => {
        seconds++;
        if (seconds === 60) {
            minutes++;
            seconds = 0;
        }
        document.getElementById('time').textContent = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    }, 1000);
}

// Function to show the congratulations message
function showCongratsMessage() {
    const congratsMessage = document.getElementById('congrats-message');
    congratsMessage.classList.remove('hidden');
    congratsMessage.style.display = 'block';

    document.getElementById('final-moves').textContent = moves;
    document.getElementById('final-time').textContent = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;

    console.log('Game completed, congratulations message displayed');
}

// Function to reset the timer
function resetTimer() {
    clearInterval(interval);
    seconds = 0;
    minutes = 0;
    document.getElementById('time').textContent = '0:00';
}

// Function to handle the "New Game" button click
document.getElementById('new-game').addEventListener('click', () => {
    resetTimer();
    moves = 0; // Reset moves on new game
    document.getElementById('moves').textContent = moves; // Update moves display
    shuffle(); // Shuffle cards again
    resetCards(); // Ensure cards are reset visually
});

// Function to reset all cards to their initial state
function resetCards() {
    cards.forEach(card => {
        card.classList.remove('flip');
        card.addEventListener('click', flipCard);
    });
}

// Function to shuffle the cards using the Fisher-Yates shuffle algorithm
function shuffle() {
    cards.forEach(card => {
        card.style.order = Math.floor(Math.random() * cards.length);
    });
}

// Initialize the game
shuffle();
cards.forEach(card => card.addEventListener('click', flipCard));
