const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const GRAVITY = 0.5;
const FLAP_STRENGTH = -10;
const PIPE_WIDTH = 80;
const PIPE_GAP = 150;

let bird = {
    x: 50,
    y: 300,
    width: 34,
    height: 24,
    velocity: 0,
    draw() {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    },
    flap() {
        this.velocity = FLAP_STRENGTH;
    },
    update() {
        this.velocity += GRAVITY;
        this.y += this.velocity;
    }
};

let pipes = [];
let score = 0;
let frameCount = 0;
let gameOver = false;

function createPipe() {
    const height = Math.floor(Math.random() * (canvas.height - PIPE_GAP - 100)) + 50;
    pipes.push({
        x: canvas.width,
        height: height,
        passed: false,
        draw() {
            ctx.fillStyle = 'green';
            ctx.fillRect(this.x, 0, PIPE_WIDTH, this.height);
            ctx.fillRect(this.x, this.height + PIPE_GAP, PIPE_WIDTH, canvas.height - this.height - PIPE_GAP);
        },
        update() {
            this.x -= 5;
        },
        collide(bird) {
            return bird.x + bird.width > this.x && bird.x < this.x + PIPE_WIDTH &&
                (bird.y < this.height || bird.y + bird.height > this.height + PIPE_GAP);
        }
    });
}

function resetGame() {
    bird = { x: 50, y: 300, width: 34, height: 24, velocity: 0, draw: bird.draw, flap: bird.flap, update: bird.update };
    pipes = [];
    score = 0;
    frameCount = 0;
    gameOver = false;
}

function gameLoop() {
    if (gameOver) {
        ctx.fillStyle = 'black';
        ctx.font = '36px Arial';
        ctx.fillText(`Game Over! Score: ${score}`, 50, canvas.height / 2);
        ctx.fillText('Press R to Restart', 50, canvas.height / 2 + 40);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    bird.update();
    bird.draw();

    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        gameOver = true;
    }

    if (frameCount % 90 === 0) {
        createPipe();
    }

    pipes.forEach(pipe => {
        pipe.update();
        pipe.draw();

        if (pipe.collide(bird)) {
            gameOver = true;
        }

        if (pipe.x + PIPE_WIDTH < bird.x && !pipe.passed) {
            pipe.passed = true;
            score++;
        }
    });

    pipes = pipes.filter(pipe => pipe.x + PIPE_WIDTH > 0);

    frameCount++;
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && !gameOver) {
        bird.flap();
    }
    if (event.code === 'KeyR' && gameOver) {
        resetGame();
    }
});

gameLoop();