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
        food = {
          x: Math.floor(Math.random() * (canvasWidth / box)) * box,
          y: Math.floor(Math.random() * (canvasHeight / box)) * box
        };
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
        gameOver();
        return;
      }
  
      snake.unshift(newHead);
    }
  
    function startGame() {
      // Show canvas and hide start menu
      canvas.style.display = 'block';
      document.getElementById('startMenu').style.display = 'none';
  
      // Start game loop
      gameInterval = setInterval(draw, 100);
    }
  
    function openOptionsMenu() {
      // Hide canvas and show options menu
      canvas.style.display = 'none';
      document.getElementById('startMenu').style.display = 'none';
      document.getElementById('optionsMenu').style.display = 'block';
    }
  
    function backToStart() {
      // Show start menu and hide options menu
      canvas.style.display = 'none';
      document.getElementById('startMenu').style.display = 'block';
      document.getElementById('optionsMenu').style.display = 'none';
    }
  
    function gameOver() {
      clearInterval(gameInterval);
      alert(`Game Over! Your score: ${score}`);
      resetGame();
    }
  
    function resetGame() {
      // Reset snake, direction, score, and food
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
  
      // Show start menu and hide canvas and options menu
      canvas.style.display = 'none';
      document.getElementById('startMenu').style.display = 'block';
      document.getElementById('optionsMenu').style.display = 'none';
    }
  
    document.getElementById('startButton').addEventListener('click', startGame);
    document.getElementById('optionsButton').addEventListener('click', openOptionsMenu);
    document.getElementById('backToStartButton').addEventListener('click', backToStart);
  
    document.addEventListener('keydown', directionHandler);
  
    function directionHandler(event) {
      const key = event.key;
      if ((key === 'ArrowLeft' || key === 'a') && direction !== 'RIGHT') direction = 'LEFT';
      if ((key === 'ArrowUp' || key === 'w') && direction !== 'DOWN') direction = 'UP';
      if ((key === 'ArrowRight' || key === 'd') && direction !== 'LEFT') direction = 'RIGHT';
      if ((key === 'ArrowDown' || key === 's') && direction !== 'UP') direction = 'DOWN';
    }
  
    function collision(head, array) {
      return array.some(part => head.x === part.x && head.y === part.y);
    }
  
    // Change snake color when selected from the options menu
    document.getElementById('snakeColorSelect').addEventListener('change', function() {
      snakeColor = this.value;
    });
  });
  