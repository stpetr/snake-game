import './styles.css'

function snakeGame(canvas) {
  const FIELD_ROWS = 15,
    FIELD_COLS = 25,
    FIELD_RATIO = FIELD_COLS / FIELD_ROWS,
    FIELD_MAX_HEIGHT = 600,
    FIELD_MARGIN_VERTICAL = 20,
    FIELD_MARGIN_HORIZONTAL = 20,
    GAME_STATE_PLAY = 'play',
    GAME_STATE_PAUSE = 'pause',
    GAME_STATE_READY = 'ready',
    GAME_STATE_GAME_OVER = 'game-over',
    DIRECTION_UP = 'up',
    DIRECTION_DOWN = 'down',
    DIRECTION_LEFT = 'left',
    DIRECTION_RIGHT = 'right',
    DEFAULT_SNAKE_LENGTH = 3,
    DEFAULT_SPEED = 300

  let gameState = GAME_STATE_READY
  let speed = DEFAULT_SPEED

  // @todo refactor
  let cellSize = 0

  const field = {
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  }

  const snake = {
    parts: [],
    direction: DIRECTION_UP,
  }

  const food = {
    x: 5,
    y: 5,
    counter: 0,
  }

  if (!(canvas instanceof HTMLCanvasElement)) {
    alert('No canvas element passed to constructor')
    return
  }

  const ctx = canvas.getContext('2d')

  function resetLevels() {

  }

  function resetGame() {
    resetSnake()
    putFood()

    speed = DEFAULT_SPEED
    gameState = GAME_STATE_PLAY
  }

  function putFood() {
    const freeSlots = []
    for (let y = 0; y < FIELD_ROWS; y++) {
      for (let x = 0; x < FIELD_COLS; x++) {
        if (!snake.parts.some((part) => part.x === x && part.y === y)) {
          freeSlots.push({x, y})
        }
      }
    }

    const randomSlotIndex = Math.floor(Math.random() * freeSlots.length)
    const randomSlot = freeSlots[randomSlotIndex]

    food.x = randomSlot.x
    food.y = randomSlot.y
  }

  function resetSnake() {
    snake.parts.splice(0, snake.parts.length)
    snake.parts.push({
      x: Math.floor(FIELD_COLS / 2),
      y: Math.floor(FIELD_ROWS / 2),
    })

    snake.direction = DIRECTION_UP
    for (let i = 0; i < DEFAULT_SNAKE_LENGTH; i++) {
      enlargeSnake()
    }
  }

  function enlargeSnake() {
    let deltaX = 0
    let deltaY = 0
    const lastPart = snake.parts[snake.parts.length - 1]

    switch (snake.direction) {
      case DIRECTION_UP:
        deltaY = 1
        break
      case DIRECTION_DOWN:
        deltaY = -1
        break
      case DIRECTION_LEFT:
        deltaX = 1
        break
      case DIRECTION_RIGHT:
        deltaX = -1
        break
    }

    snake.parts.push({
      x: lastPart.x + deltaX,
      y: lastPart.y + deltaY,
    })
  }

  function moveSnake() {
    const head = {...snake.parts[0]}

    let deltaX = 0
    let deltaY = 0

    switch (snake.direction) {
      case DIRECTION_UP:
        deltaY = -1
        break
      case DIRECTION_DOWN:
        deltaY = 1
        break
      case DIRECTION_LEFT:
        deltaX = -1
        break
      case DIRECTION_RIGHT:
        deltaX = 1
        break
      default:
        console.warn('Something weird happened in moveSnake function', snake.direction)
    }

    // Check for backward movement
    const secondPart = snake.parts[1]
    if ((head.x + deltaX) === secondPart.x && (head.y + deltaY) === secondPart.y) {
      if (head.x === secondPart.x) {
        deltaY = (head.y - secondPart.y)
        deltaX = 0
      } else {
        deltaX = (head.x - secondPart.x)
        deltaY = 0
      }
    }

    head.x += deltaX
    head.y += deltaY

    if (head.x >= FIELD_COLS) {
      head.x = 0
    }

    if (head.x < 0) {
      head.x = FIELD_COLS - 1
    }

    if (head.y >= FIELD_ROWS) {
      head.y = 0
    }

    if (head.y < 0) {
      head.y = FIELD_ROWS - 1
    }

    snake.parts.pop()
    snake.parts.unshift(head)
  }

  function checkCollisions() {
    const head = snake.parts[0]

    // Food collision
    if (head.x === food.x && head.y === food.y) {
      enlargeSnake()
      putFood()
      food.counter += 1

      if (food.counter > 0 && food.counter % 5 === 0) {
        speed -= 20
        // console.log('level up', speed)
      }
    }

    // Snake collision
    if (snake.parts.length > 1 && snake.parts.slice(1).some(({ x, y }) => {
      return x >= 0 && x < field.width && y >= 0 && y < field.height && head.x === x && head.y === y
    })) {
      gameState = GAME_STATE_GAME_OVER
    }
  }

  function isDirectionsOpposite(direction1, direction2) {
    return direction1 === DIRECTION_UP && direction2 === DIRECTION_DOWN
      || direction1 === DIRECTION_DOWN && direction2 === DIRECTION_UP
      || direction1 === DIRECTION_LEFT && direction2 === DIRECTION_RIGHT
      || direction1 === DIRECTION_RIGHT && direction2 === DIRECTION_LEFT
  }

  function changeSnakeDirection(direction) {
    if (!isDirectionsOpposite(direction, snake.direction)) {
      snake.direction = direction
    }
  }

  function adjustCanvasSize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }

  function adjustFieldSize() {
    const canvasWidth = canvas.width
    const canvasHeight = canvas.height

    if (FIELD_MAX_HEIGHT + FIELD_MARGIN_VERTICAL * 2 < canvasHeight) {
      field.height = FIELD_MAX_HEIGHT
    } else {
      field.height = canvasHeight - FIELD_MARGIN_VERTICAL * 2
    }

    field.width = field.height * FIELD_RATIO
    field.x = (canvasWidth - field.width) / 2
    field.y = (canvasHeight - field.height) / 2

    // @todo refactor ?
    cellSize = Math.floor(field.width / FIELD_COLS)
  }

  function renderField() {
    ctx.fillStyle = '#f5f5af'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = '#f5f5f5'
    ctx.fillRect(field.x, field.y, field.width, field.height)
  }

  function renderSnake() {
    const padding = 3

    snake.parts.forEach(({ x, y }, index) => {
      if (index === 0) {
        ctx.fillStyle = '#00aa00'
      } else {
        ctx.fillStyle = '#004000'
      }
      ctx.fillRect(field.x + x * cellSize + padding, field.y + y * cellSize + padding, cellSize - padding, cellSize - padding)
    })
  }

  function renderFood() {
    const halfCell = Math.floor(cellSize / 2)

    ctx.fillStyle = '#ff9000'
    ctx.beginPath()
    // ctx.fillRect(field.x + food.x * cellSize, field.y + food.y * cellSize, cellSize, cellSize)
    ctx.arc(field.x + food.x * cellSize + halfCell, field.y + food.y * cellSize + halfCell, halfCell, 0, Math.PI * 2)
    ctx.fill()
  }

  function renderGameOver() {
    renderField()

    ctx.font = "60px Georgia";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#000000";
    ctx.fillText("Game Over", field.x + field.width / 2, field.y + field.height / 2);

    ctx.font = "30px Georgia";
    ctx.fillText(`Score: ${snake.parts.length - DEFAULT_SNAKE_LENGTH - 1}`, field.x + field.width / 2, field.y + field.height / 2 + 45);

    ctx.font = "24px Georgia";
    ctx.fillText(`Press Space to play again`, field.x + field.width / 2, field.y + field.height / 2 + 80);
  }

  // For future mobile support
  function renderControls() {

  }

  function renderScore() {
    const text = `Score: ${snake.parts.length - DEFAULT_SNAKE_LENGTH - 1} Speed: ${Math.trunc(1000 / speed)} cells per second`

    ctx.font = "24px Gothic";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#000000";

    ctx.fillText(text, field.x + field.width, field.y - 30);
  }

  function render() {
    if (gameState === GAME_STATE_GAME_OVER) {
      renderGameOver()
    } else if (gameState === GAME_STATE_PLAY) {
      renderField()
      renderSnake()
      renderFood()
      renderScore()
    }
  }

  function mainCycle() {
    if (gameState === GAME_STATE_PAUSE) {
      return
    }

    moveSnake()
    checkCollisions()

    render()

    setTimeout(mainCycle, speed)
  }

  function main() {
    resetLevels()
    resetGame()

    adjustCanvasSize()
    adjustFieldSize()
    render()

    window.addEventListener('resize', () => {
      adjustCanvasSize()
      adjustFieldSize()
      render()
    })

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (gameState === GAME_STATE_PAUSE) {
          gameState = GAME_STATE_PLAY
        } else {
          gameState = GAME_STATE_PAUSE
        }
      }

      if (gameState === GAME_STATE_PAUSE) {
        return
      }

      let direction = null

      switch (e.key) {
        case 'ArrowUp':
          direction = DIRECTION_UP
          break
        case 'ArrowDown':
          direction = DIRECTION_DOWN
          break
        case 'ArrowLeft':
          direction = DIRECTION_LEFT
          break
        case 'ArrowRight':
          direction = DIRECTION_RIGHT
          break
      }

      if (direction) {
        changeSnakeDirection(direction)

        e.preventDefault()
      }
    })


    window.addEventListener('keydown', (e) => {
      if (gameState === GAME_STATE_GAME_OVER && e.code === 'Space') {
        resetGame()
      }
    })

    mainCycle()
  }

  main()
}

(() => {
  const canvas = document.querySelector('#app-canvas')
  snakeGame(canvas)
})()
