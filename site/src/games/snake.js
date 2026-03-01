(function () {
    var canvas = document.getElementById('snake-canvas');
    var ctx = canvas.getContext('2d');
    var scoreEl = document.getElementById('score');
    var highScoreEl = document.getElementById('high-score');
    var startBtn = document.getElementById('start-btn');
    var pauseBtn = document.getElementById('pause-btn');

    var GRID = 20;
    var COLS = canvas.width / GRID;
    var ROWS = canvas.height / GRID;
    var SPEED_INITIAL = 120;
    var SPEED_MIN = 60;

    var snake, direction, nextDirection, food, score, highScore, gameLoop, running, paused;

    highScore = parseInt(localStorage.getItem('snake-high') || '0', 10);
    highScoreEl.textContent = highScore;

    // Colors
    var BG = '#16213e';
    var GRID_COLOR = '#1a2744';
    var SNAKE_HEAD = '#3b82f6';
    var SNAKE_BODY = '#2563eb';
    var SNAKE_TAIL = '#1d4ed8';
    var FOOD_COLOR = '#ef4444';
    var FOOD_GLOW = 'rgba(239, 68, 68, 0.3)';

    function init() {
        snake = [{ x: Math.floor(COLS / 2), y: Math.floor(ROWS / 2) }];
        direction = { x: 1, y: 0 };
        nextDirection = { x: 1, y: 0 };
        score = 0;
        scoreEl.textContent = '0';
        paused = false;
        running = false;
        placeFood();
        draw();
    }

    function placeFood() {
        var occupied;
        do {
            food = {
                x: Math.floor(Math.random() * COLS),
                y: Math.floor(Math.random() * ROWS)
            };
            occupied = false;
            for (var i = 0; i < snake.length; i++) {
                if (snake[i].x === food.x && snake[i].y === food.y) {
                    occupied = true;
                    break;
                }
            }
        } while (occupied);
    }

    function draw() {
        // background
        ctx.fillStyle = BG;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // grid lines
        ctx.strokeStyle = GRID_COLOR;
        ctx.lineWidth = 0.5;
        for (var x = 0; x < COLS; x++) {
            ctx.beginPath();
            ctx.moveTo(x * GRID, 0);
            ctx.lineTo(x * GRID, canvas.height);
            ctx.stroke();
        }
        for (var y = 0; y < ROWS; y++) {
            ctx.beginPath();
            ctx.moveTo(0, y * GRID);
            ctx.lineTo(canvas.width, y * GRID);
            ctx.stroke();
        }

        // food glow
        ctx.shadowColor = FOOD_GLOW;
        ctx.shadowBlur = 15;
        ctx.fillStyle = FOOD_COLOR;
        ctx.beginPath();
        ctx.arc(food.x * GRID + GRID / 2, food.y * GRID + GRID / 2, GRID / 2 - 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // snake
        for (var i = snake.length - 1; i >= 0; i--) {
            var seg = snake[i];
            if (i === 0) {
                ctx.fillStyle = SNAKE_HEAD;
            } else if (i < snake.length * 0.5) {
                ctx.fillStyle = SNAKE_BODY;
            } else {
                ctx.fillStyle = SNAKE_TAIL;
            }
            var pad = i === 0 ? 1 : 2;
            ctx.beginPath();
            ctx.roundRect(seg.x * GRID + pad, seg.y * GRID + pad, GRID - pad * 2, GRID - pad * 2, 4);
            ctx.fill();
        }

        // overlay messages
        if (!running && score === 0 && snake.length === 1) {
            drawOverlay('Press Start or any arrow key');
        } else if (!running && score > 0) {
            drawOverlay('Game Over! Score: ' + score);
        } else if (paused) {
            drawOverlay('Paused');
        }
    }

    function drawOverlay(text) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#fff';
        ctx.font = '600 20px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    }

    function update() {
        direction = nextDirection;
        var head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

        // wall collision
        if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
            gameOver();
            return;
        }

        // self collision
        for (var i = 0; i < snake.length; i++) {
            if (snake[i].x === head.x && snake[i].y === head.y) {
                gameOver();
                return;
            }
        }

        snake.unshift(head);

        // eat food
        if (head.x === food.x && head.y === food.y) {
            score += 10;
            scoreEl.textContent = score;
            placeFood();
            // speed up slightly
            var speed = Math.max(SPEED_MIN, SPEED_INITIAL - Math.floor(score / 50) * 10);
            clearInterval(gameLoop);
            gameLoop = setInterval(tick, speed);
        } else {
            snake.pop();
        }

        draw();
    }

    function tick() {
        if (!paused) update();
    }

    function startGame() {
        if (running) return;
        init();
        running = true;
        startBtn.textContent = 'Restart';
        pauseBtn.disabled = false;
        pauseBtn.textContent = 'Pause';
        gameLoop = setInterval(tick, SPEED_INITIAL);
        draw();
    }

    function gameOver() {
        running = false;
        clearInterval(gameLoop);
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('snake-high', highScore);
            highScoreEl.textContent = highScore;
        }
        startBtn.textContent = 'Play Again';
        pauseBtn.disabled = true;
        draw();
    }

    function togglePause() {
        if (!running) return;
        paused = !paused;
        pauseBtn.textContent = paused ? 'Resume' : 'Pause';
        if (paused) draw();
    }

    function setDirection(dx, dy) {
        // prevent 180° turns
        if (direction.x === -dx && direction.y === -dy) return;
        if (direction.x === dx && direction.y === dy) return;
        nextDirection = { x: dx, y: dy };
        if (!running) startGame();
    }

    // Keyboard controls
    document.addEventListener('keydown', function (e) {
        switch (e.key) {
            case 'ArrowUp': case 'w': case 'W':
                e.preventDefault();
                setDirection(0, -1);
                break;
            case 'ArrowDown': case 's': case 'S':
                e.preventDefault();
                setDirection(0, 1);
                break;
            case 'ArrowLeft': case 'a': case 'A':
                e.preventDefault();
                setDirection(-1, 0);
                break;
            case 'ArrowRight': case 'd': case 'D':
                e.preventDefault();
                setDirection(1, 0);
                break;
            case ' ':
                e.preventDefault();
                togglePause();
                break;
        }
    });

    // Buttons
    startBtn.addEventListener('click', startGame);
    pauseBtn.addEventListener('click', togglePause);

    // Mobile d-pad
    var dpadBtns = document.querySelectorAll('.dpad-btn');
    for (var i = 0; i < dpadBtns.length; i++) {
        (function (btn) {
            btn.addEventListener('touchstart', function (e) {
                e.preventDefault();
                var dir = btn.getAttribute('data-dir');
                switch (dir) {
                    case 'up': setDirection(0, -1); break;
                    case 'down': setDirection(0, 1); break;
                    case 'left': setDirection(-1, 0); break;
                    case 'right': setDirection(1, 0); break;
                }
            });
            btn.addEventListener('click', function () {
                var dir = btn.getAttribute('data-dir');
                switch (dir) {
                    case 'up': setDirection(0, -1); break;
                    case 'down': setDirection(0, 1); break;
                    case 'left': setDirection(-1, 0); break;
                    case 'right': setDirection(1, 0); break;
                }
            });
        })(dpadBtns[i]);
    }

    // roundRect polyfill for older browsers
    if (!ctx.roundRect) {
        CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
            if (typeof r === 'number') r = [r, r, r, r];
            this.moveTo(x + r[0], y);
            this.lineTo(x + w - r[1], y);
            this.quadraticCurveTo(x + w, y, x + w, y + r[1]);
            this.lineTo(x + w, y + h - r[2]);
            this.quadraticCurveTo(x + w, y + h, x + w - r[2], y + h);
            this.lineTo(x + r[3], y + h);
            this.quadraticCurveTo(x, y + h, x, y + h - r[3]);
            this.lineTo(x, y + r[0]);
            this.quadraticCurveTo(x, y, x + r[0], y);
            this.closePath();
        };
    }

    init();
})();
