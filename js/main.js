function snakeGame(canvas) {
  const FIELD_ROWS = 15,
    FIELD_COLS = 25,
    FIELD_RATIO = FIELD_COLS / FIELD_ROWS,
    FIELD_MAX_HEIGHT = 600,
    FIELD_MARGIN = 20,
    GAME_STATE_PLAY = 'play',
    GAME_STATE_PAUSE = 'pause',
    GAME_STATE_START_LEVEL = 'start-level',
    GAME_STATE_FINISH_LEVEL = 'finish-level',
    DIRECTION_UP = 'up',
    DIRECTION_DOWN = 'down',
    DIRECTION_LEFT = 'left',
    DIRECTION_RIGHT = 'right'

  // @todo move to level object
  let speed = 500

  // @todo refactor
  let cellSize = 0

  const field = {
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  }

  const snake = {
    head: {
      x: Math.floor(FIELD_COLS / 2),
      y: Math.floor(FIELD_ROWS / 2),
    },
    parts: [

    ],
    direction: DIRECTION_UP,
  }

  const food = {
    x: 0,
    y: 0,
  }

  if (!(canvas instanceof HTMLCanvasElement)) {
    alert('No canvas element passed to constructor')
    return
  }

  const ctx = canvas.getContext('2d')

  function resetLevels() {

  }

  function resetGame() {

  }

  function moveSnake() {
    switch (snake.direction) {
      case DIRECTION_UP:
        snake.head.y -= 1
        break
      case DIRECTION_DOWN:
        snake.head.y += 1
        break
      case DIRECTION_LEFT:
        snake.head.x -= 1
        break
      case DIRECTION_RIGHT:
        snake.head.x += 1
        break
      default:
        console.warn('Something weird happened in moveSnake function', snake.direction)
    }

    if (snake.head.x >= FIELD_COLS) {
      snake.head.x = 0
    }

    if (snake.head.x < 0) {
      snake.head.x = FIELD_COLS - 1
    }

    if (snake.head.y >= FIELD_ROWS) {
      snake.head.y = 0
    }

    if (snake.head.y < 0) {
      snake.head.y = FIELD_ROWS - 1
    }

    if (snake.head.x === food.x && snake.head.y === food.y) {
      snake.parts.push(1)
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

    if (FIELD_MAX_HEIGHT + FIELD_MARGIN * 2 < canvasHeight) {
      field.height = FIELD_MAX_HEIGHT
    } else {
      field.height = canvasHeight - FIELD_MARGIN * 2
    }

    field.width = field.height * FIELD_RATIO
    field.x = (canvasWidth - field.width) / 2
    field.y = (canvasHeight - field.height) / 2

    // @todo refactor ?
    cellSize = Math.floor(field.width / FIELD_COLS)
  }

  function renderField() {
    ctx.fillStyle = '#f1f10f'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = '#f5f5f5'
    ctx.fillRect(field.x, field.y, field.width, field.height)
  }

  function renderSnake() {
    const { x, y } = snake.head

    ctx.fillStyle = '#909000'
    ctx.fillRect(field.x + x * cellSize, field.y + y * cellSize, cellSize, cellSize)

    snake.parts.forEach((_, index) => {
      let xDelta = 0
      let yDelta = 0
      switch (snake.direction) {
        case DIRECTION_UP:
          yDelta = 1 + index
          break
        case DIRECTION_DOWN:
          yDelta = -1 - index
          break
        case DIRECTION_LEFT:
          xDelta = 1 + index
          break
        case DIRECTION_RIGHT:
          xDelta = -1 - index
          break
      }

      ctx.fillStyle = '#000000'
      ctx.fillRect(field.x + (x + xDelta) * cellSize, field.y + (y + yDelta) * cellSize, cellSize, cellSize)
    })
  }

  function renderFood() {
    ctx.fillStyle = '#ff9000'
    ctx.fillRect(field.x + food.x * cellSize, field.y + food.y * cellSize, cellSize, cellSize)
  }

  function render() {
    renderField()
    renderSnake()
    renderFood()
  }

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
    // @todo implement debounce

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

  let interval = setInterval(() => {
    moveSnake()

    render()
  }, speed)
}

(() => {
  const canvas = document.querySelector('#app-canvas')
  snakeGame(canvas)
})()
