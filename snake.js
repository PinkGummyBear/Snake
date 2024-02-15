document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  const box = 20;
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  let snake = [];
  snake[0] = {
    x: canvasWidth / 2,
    y: canvasHeight / 2
  };

  let food = {
    x: Math.floor(Math.random() * (canvasWidth / box)) * box,
    y: Math.floor(Math.random() * (canvasHeight / box)) * box
  };

  let direction = 'RIGHT';
  let score = 0;
  let gameInterval;
  let snakeColor = 'green';
  let bearMode = false; // Variable to track bear mode

  // Load sound effects
  const backgroundSound = new Audio('SoundEffect/background.mp3');
  const deathSound = new Audio('SoundEffect/death.mp3');
  const collectSound = new Audio('SoundEffect/collect.mp3');
  const customizeSound = new Audio('SoundEffect/customize.mp3');
  const buttonPressSound = new Audio('SoundEffect/buttonpress.mp3');

  function playSound(sound) {
    sound.currentTime = 0;
    sound.play();
  }

  

  const soundToggle = document.getElementById('soundToggle');
  soundToggle.addEventListener('change', () => {
   
      if (soundToggle.checked) {
          // Enable sound effects
          backgroundSound.muted = false;
          // Enable other sound effects similarly
      } else {
          // Disable sound effects
          backgroundSound.muted = true;
          // Disable other sound effects similarly
      }
  
  });

  soundToggle.addEventListener('change', () => {
    if (soundToggle.checked) {
      // Enable sound effects
      backgroundSound.muted = false;
      deathSound.muted = false;
      collectSound.muted = false;
      customizeSound.muted = false;
      buttonPressSound.muted = false;
    } else {
      // Disable sound effects
      backgroundSound.muted = true;
      deathSound.muted = true;
      collectSound.muted = true;
      customizeSound.muted = true;
      buttonPressSound.muted = true;
    }
  });

  const snakeHeadImage = new Image();
  snakeHeadImage.src = 'snake_head.png'; // Path to your snake head image

  function drawSnakePart(part) {
    if (part === snake[0]) {
      if (snakeHeadImage.complete && snakeHeadImage.naturalHeight !== 0) {
        ctx.drawImage(snakeHeadImage, part.x, part.y, box, box);
      } else {
        ctx.fillStyle = snakeColor;
        ctx.fillRect(part.x, part.y, box, box);
      }
    } else {
      ctx.fillStyle = snakeColor;
      ctx.fillRect(part.x, part.y, box, box);

      ctx.strokeStyle = 'black';
      ctx.strokeRect(part.x, part.y, box, box);
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    snake.forEach(drawSnakePart);

    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === 'LEFT') snakeX -= box;
    if (direction === 'UP') snakeY -= box;
    if (direction === 'RIGHT') snakeX += box;
    if (direction === 'DOWN') snakeY += box;

    if (snakeX === food.x && snakeY === food.y) {
        score++;
        document.getElementById('currentScore').textContent = score; // Update the score
        const currentHighScore = localStorage.getItem('highScore') || 0;
        if (score > currentHighScore) {
          localStorage.setItem('highScore', score);
          document.getElementById('highScore').textContent = score; // Update the high score display
          }

        food = {
            x: Math.floor(Math.random() * (canvasWidth / box)) * box,
            y: Math.floor(Math.random() * (canvasHeight / box)) * box
        };
        playSound(collectSound); // Play collect sound
    } else {
        snake.pop();
    }

    let newHead = {
        x: snakeX,
        y: snakeY
    };

    if (
        snakeX < 0 ||
        snakeY < 0 ||
        snakeX >= canvasWidth ||
        snakeY >= canvasHeight ||
        collision(newHead, snake)
    ) {
        playSound(deathSound); // Play death sound
        gameOver();
        return;
    }

    snake.unshift(newHead);
}


  function updateScore() {
    document.getElementById('currentScore').textContent = score;
    document.getElementById('highScore').textContent = localStorage.getItem('highScore') || 0;
  }
  
  document.getElementById('retryButton').addEventListener('click', () => {
    playSound(buttonPressSound); // Play button press sound
    resetGame(); // Restart the game
    startGame(); // Start the game again
});

document.getElementById('exitButton').addEventListener('click', () => {
    playSound(buttonPressSound); // Play button press sound
    document.getElementById('gameOverScreen').style.display = 'none'; // Hide game over screen
    document.getElementById('startMenu').style.display = 'block'; // Show start menu
});

  function startGame() {
    playSound(backgroundSound); // Start background music
    canvas.style.display = 'block';
    document.getElementById('startMenu').style.display = 'none';
    document.getElementById('scoreboard').style.display = 'block';
    gameInterval = setInterval(draw, 100);

    score = 0;
    updateScore();
  }

  function openOptionsMenu() {
    canvas.style.display = 'none';
    document.getElementById('startMenu').style.display = 'none';
    document.getElementById('optionsMenu').style.display = 'block';
  }

  function backToStart() {
    canvas.style.display = 'none';
    document.getElementById('startMenu').style.display = 'block';
    document.getElementById('optionsMenu').style.display = 'none';
  }

  function gameOver() {
    clearInterval(gameInterval);
    document.getElementById('scoreboard').style.display = 'none'; // Hide scoreboard
    document.getElementById('gameOverScreen').style.display = 'block'; // Show game over screen
    document.getElementById('finalScore').textContent = score; // Update final score

    const currentHighScore = localStorage.getItem('highScore') || 0;
    if (score > currentHighScore) {
        localStorage.setItem('highScore', score);
        document.getElementById('highScore').textContent = score; // Update high score if beaten
    }

    // Hide canvas and start menu
    document.getElementById('gameCanvas').style.display = 'none';
    document.getElementById('startMenu').style.display = 'none';
}



function resetGame() {
  snake = [{
      x: canvasWidth / 2,
      y: canvasHeight / 2
  }];
  direction = 'RIGHT';
  score = 0;
  food = {
      x: Math.floor(Math.random() * (canvasWidth / box)) * box,
      y: Math.floor(Math.random() * (canvasHeight / box)) * box
  };

  // Stop background music
  backgroundSound.pause();
  backgroundSound.currentTime = 0;

  // Hide game over screen
  document.getElementById('gameOverScreen').style.display = 'none';

  // Display start menu
  document.getElementById('startMenu').style.display = 'block';
}


  document.getElementById('startButton').addEventListener('click', () => {
    playSound(buttonPressSound); // Play button press sound
    startGame();
  });

  document.getElementById('optionsButton').addEventListener('click', () => {
    playSound(buttonPressSound); // Play button press sound
    openOptionsMenu();
  });

  document.getElementById('backToStartButton').addEventListener('click', () => {
    playSound(buttonPressSound); // Play button press sound
    backToStart();
  });

  document.addEventListener('keydown', directionHandler);

  function directionHandler(event) {
    const key = event.key;
    if ((key === 'ArrowLeft' || key === 'a') && direction !== 'RIGHT') direction = 'LEFT';
    if ((key === 'ArrowUp' || key === 'w') && direction !== 'DOWN') direction = 'UP';
    if ((key === 'ArrowRight' || key === 'd') && direction !== 'LEFT') direction = 'RIGHT';
    if ((key === 'ArrowDown' || key === 's') && direction !== 'UP') direction = 'DOWN';
  }

  function collision(head, array) {
    // Check if head collides with any part of the snake
    if (array.some(part => head.x === part.x && head.y === part.y)) {
      return true;
    }
    
    // Check if head collides with the canvas boundaries
    if (
      head.x < 0 || 
      head.y < 0 || 
      head.x >= canvasWidth || 
      head.y >= canvasHeight
    ) {
      return true;
    }
    
    return false;
  }

  // Change snake color when selected from the options menu
  document.getElementById('snakeColorSelect').addEventListener('change', function() {
    snakeColor = this.value;
    playSound(customizeSound);
  });



  updateScore();
});


