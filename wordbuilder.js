document.addEventListener('DOMContentLoaded', () => {
    const scrambledWordElement = document.getElementById('scrambled-word');
    const guessInput = document.getElementById('guess-input');
    const submitButton = document.getElementById('submit-button');
    const viewAnswerButton = document.getElementById('view-answer-button');
    const feedbackElement = document.getElementById('feedback');

    let currentWord = '';
    let scrambled = '';

    async function getNewWord() {
        try {
            const response = await fetch('/api/word');
            if (!response.ok) {
                throw new Error('Failed to fetch word');
            }
            const data = await response.json();
            currentWord = data.word;
            scrambled = data.scrambled;
            scrambledWordElement.textContent = scrambled.replace(/_/g, ' _ ');
            feedbackElement.textContent = '';
            guessInput.value = '';
        } catch (error) {
            console.error('Error fetching new word:', error);
            scrambledWordElement.textContent = 'Error loading word.';
        }
    }

    function checkGuess() {
        const guess = guessInput.value.trim().toLowerCase();
        if (guess === currentWord.toLowerCase()) {
            feedbackElement.textContent = 'Correct! Getting a new word...';
            feedbackElement.style.color = 'green';
            setTimeout(getNewWord, 2000);
        } else {
            feedbackElement.textContent = 'Incorrect. Try again!';
            feedbackElement.style.color = 'red';
        }
    }

    function viewAnswer() {
        scrambledWordElement.textContent = currentWord;
        feedbackElement.textContent = 'The answer is revealed.';
        feedbackElement.style.color = 'blue';
    }

    submitButton.addEventListener('click', checkGuess);
    guessInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            checkGuess();
        }
    });
    viewAnswerButton.addEventListener('click', viewAnswer);

    getNewWord();
});
