console.clear();

const divs = document.querySelectorAll("div");
let playing = false;
let prevMove = "right";
let direction = "right";
let lastTimeApple = Date.now();
let speed = 320;
let snake = [
  [2, 0],
  [1, 0],
  [0, 0],
];
let apples = [];

/* Remove styles on every div */
function clearScene() {
  divs.forEach((div) => (div.className = ""));
}

/* Check if the snake is eating an apple */
function eatApple() {
  apples.forEach((apple, i) => {
    // Check if the snake head is on the apple coordinates
    if (snake[0][0] === apple[0] && snake[0][1] === apple[1]) {
      snake.push([snake[snake.length - 1][0], snake[snake.length - 1][1]]);
      // Remove the apple from the game
      apples.splice(i, 1);

      // Speed up the game once the snake ate an apple
      speed = Math.max(speed - 8, 80);
    }
  });
}

/* Add a new apple in the game */
function popApple() {
  apples.push([Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)]);
}

/* Move the snake based on the current direction */
function moveSnake() {
  // But first check if snake is moving into a wall
  if (direction === "right") {
    if (snake[0][0] === 9) end();
  } else if (direction === "down") {
    if (snake[0][1] === 9) end();
  } else if (direction === "left") {
    if (snake[0][0] === 0) end();
  } else if (direction === "up") {
    if (snake[0][1] === 0) end();
  }

  // If snake didn't hit a wall, move it
  if (playing) {
    // Move every part of the tail (except for the head)
    for (let i = snake.length - 1; i > 0; i--) {
      snake[i] = Array.from(snake[i - 1]);
    }
    // Update the head position based on the direction
    if (direction === "right") {
      snake[0][0] += 1;
    } else if (direction === "down") {
      snake[0][1] += 1;
    } else if (direction === "left") {
      snake[0][0] -= 1;
    } else if (direction === "up") {
      snake[0][1] -= 1;
    }
  }
  // Store the previous movement
  prevMove = direction;
}

/* Draw the snake head & tail in the scene */
function drawSnake() {
  snake.forEach((cell) => {
    divs[cell[0] + cell[1] * 10].classList.add("snake");
  });
  // Add a class head on the head to show the snake emoji
  divs[snake[0][0] + snake[0][1] * 10].classList.add("head");
}

/* Draw all the apples in the scene */
function drawApples() {
  apples.forEach((apple) => {
    divs[apple[0] + apple[1] * 10].classList.add("apple");
  });
}

/* When game is over */
function end() {
  playing = false;
  document.body.classList.remove("playing");
  // Replace snake emoji by a skull head
  divs[snake[0][0] + snake[0][1] * 10].classList.add("dead");
  // Display score
  const score = snake.length - 3;
  document.body.setAttribute(
    "data-score",
    `You ate ${score} apple${score > 1 ? "s" : ""}!`
  );
}

let lastTick = Date.now();
/* Brain of the game, calling all needed function */
function render() {
  // If game is still running, call rAF
  if (playing) requestAnimationFrame(render);

  // Check if we need to render the scene
  if (Date.now() - lastTick > speed) {
    clearScene();
    // Pop an apple every 3 seconds, max 4 apples in the game at once
    if (Date.now() - lastTimeApple > 3000 && apples.length < 4) {
      popApple();
      lastTimeApple = Date.now();
    }
    moveSnake();
    drawSnake();
    eatApple();
    drawApples();

    lastTick = Date.now();
  }
}

/* When user pressed a key */
function onKeyDown() {
  if (event.keyCode === 38) {
    if (prevMove !== "down") direction = "up";
  } else if (event.keyCode === 40) {
    if (prevMove !== "up") direction = "down";
  } else if (event.keyCode === 39) {
    if (prevMove !== "left") direction = "right";
  } else if (event.keyCode === 37) {
    if (prevMove !== "right") direction = "left";
  }
}
    
if (window.innerWidth < 1000) {
  document.body.setAttribute("data-score", `Swipe to move`);
} else {
  document.body.setAttribute("data-score", `Use arrows keys to move ↑→↓←`);
}
window.addEventListener("keydown", onKeyDown);
const hammertime = new Hammer(document.body);
hammertime.get("swipe").set({ direction: Hammer.DIRECTION_ALL });
hammertime.on("swipe", (e) => {
  if (e.direction === Hammer.DIRECTION_UP) {
    if (prevMove !== "down") direction = "up";
  } else if (e.direction === Hammer.DIRECTION_DOWN) {
    if (prevMove !== "up") direction = "down";
  } else if (e.direction === Hammer.DIRECTION_RIGHT) {
    if (prevMove !== "left") direction = "right";
  } else if (e.direction === Hammer.DIRECTION_LEFT) {
    if (prevMove !== "right") direction = "left";
  }
});

/* Detect click on the body to re/start the game */
document.body.addEventListener("click", () => {
  if (playing) return;

  document.body.classList.add("playing");
  apples = [];
  snake = [
    [2, 0],
    [1, 0],
    [0, 0],
  ];
  direction = prevMove = "right";
  playing = true;
  speed = 320;
  popApple();
  drawSnake();
  render();
});
