const canvas = document.getElementById("poolTable");
const ctx = canvas.getContext("2d");
const forceInput = document.getElementById("force");

canvas.width = 800;
canvas.height = 400;

const balls = [
    { x: 100, y: 200, vx: 0, vy: 0, color: "white", radius: 10 },
    { x: 300, y: 200, vx: 0, vy: 0, color: "red", radius: 10 },
    { x: 320, y: 180, vx: 0, vy: 0, color: "yellow", radius: 10 },
    { x: 330, y: 190, vx: 0, vy: 0, color: "blue", radius: 10 },
    { x: 340, y: 200, vx: 0, vy: 0, color: "green", radius: 10}
];

const holes = [
    { x: 10, y: 10 },
    { x: canvas.width - 10, y: 10 },
    { x: canvas.width / 2, y: 10 },
    { x: 10, y: canvas.height - 10 },
    { x: canvas.width - 10, y: canvas.height - 10 },
    { x: canvas.width / 2, y: canvas.height - 10 }, 
];

function drawHoles() {
    holes.forEach((hole) => {
        ctx.beginPath();
        ctx.arc(hole.x, hole.y, 15, 0, Math.PI * 2);
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.closePath();
    });
}

function drawBall(ball) {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
}

function detectBallCollisions() {
    for(let i = 0; i < balls.length; i++) {
        for(let j = 0 + 1; j < balls.length; j++) {
            const dx = balls[i].x - balls[j].x;
            const dy = balls[i].y - balls[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < balls[i].radius + balls[j].radius) {
                const angle = Math.atan2(dy, dx);
                const speed1 = Math.sqrt(balls[i].vx ** 2 + balls[i].vy ** 2);
                const speed2 = Math.sqrt(balls[j].vx ** 2 + balls[j].vy ** 2);
        
                balls[i].vx = speed2 * Math.cos(angle);
                balls[i].vy = speed2 * Math.sin(angle);
                balls[j].vx = speed1 * Math.cos(angle + Math.PI);
                balls[j].vy = speed1 * Math.sin(angle + Math.PI);
            }
        }
    }
}

function detectHoles() {
    balls.forEach((ball, index) => {
        holes.forEach((hole) => {
            const dx = ball.x - hole.x;
            const dy = ball.y - hole.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if(distance < 15) {
                balls.splice(index, 1);
            }
        });
    });
}

function updateBalls() {
    balls.forEach((ball) => {
      ball.x += ball.vx;
      ball.y += ball.vy;
  
      // Atrito para reduzir velocidade
      ball.vx *= 0.99;
      ball.vy *= 0.99;
  
      // Detectar colisão com bordas
      if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
        ball.vx *= -1;
      }
      if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.vy *= -1;
      }
    });
  
    detectBallCollisions();
    detectHoles();
}

function drawTable() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawHoles();
    balls.forEach(drawBall);
}

function gameLoop() {
    updateBalls();
    drawTable();
    requestAnimationFrame(gameLoop);
}

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const cueBall = balls[0];
    const angle = Math.atan2(mouseX - cueBall.y, mouseX - cueBall.x);

    const force = parseInt(forceInput.value);

    cueBall.vx = Math.cos(angle) * force;
    cueBall.vy = Math.sin(angle) * force;
});

gameLoop();