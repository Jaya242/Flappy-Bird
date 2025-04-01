var move_speed = 20, gravity = 1;
var game_state = "start";
var bird_dy = 0; //The vertical velocity of the bird.
var jump_strength = -7.6;//The initial upward velocity given to the bird when the user presses a jump key.
var pipe_gap = 280;

// Selecting elements
var img = document.getElementById("bird-1");
var bird = document.querySelector(".bird");
var background = document.querySelector(".background").getBoundingClientRect();
var message = document.querySelector(".message");
var score_var = document.querySelector(".score_var");
var pipes_container = document.getElementById("pipes");

// Initial setup
img.style.display = "none";
message.classList.add("message2");

// Event listener to start game
document.addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && game_state !== "Play") {
        startGame();
    }
});

// Function to start the game
function startGame() {
    // Clear existing pipes
    pipes_container.innerHTML = "";

    // Reset game values
    img.style.display = "block";
    bird.style.top = "40vh";
    bird_dy = 0;
    game_state = "Play";
    message.innerHTML = "";
    score_var.innerHTML = "0";
    message.classList.remove("message2");

    // Start game loops
    requestAnimationFrame(move);
    requestAnimationFrame(applyGravity);
    pipe_interval = setInterval(create_pipe, 1000);
}

// Bird movement logic
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" || e.key === " ") {
        bird_dy = jump_strength;
    }
});

// Apply gravity to the bird
function applyGravity() {
    if (game_state !== "Play") return;
    bird_dy += gravity;
    let bird_props = bird.getBoundingClientRect();

    // Check if bird hits the ground or top
    if (bird_props.top <= 0 || bird_props.bottom >= background.bottom) {
        endGame();
        return;
    }

    bird.style.top = (bird.offsetTop + bird_dy) + "px";
    requestAnimationFrame(applyGravity);
}

// Move pipes and check for collisions
function move() {
    if (game_state !== "Play") return;

    let pipes = document.querySelectorAll(".pipe");
    let bird_props = bird.getBoundingClientRect();

    pipes.forEach((pipe) => {
        let pipe_props = pipe.getBoundingClientRect();

        // Remove pipes that go off-screen
        if (pipe_props.right <= 0) {
            pipe.remove();
        } else {
            // Collision detection
            if (
                bird_props.left < pipe_props.left + pipe_props.width &&
                bird_props.left + bird_props.width > pipe_props.left &&
                bird_props.top < pipe_props.top + pipe_props.height &&
                bird_props.top + bird_props.height > pipe_props.top
            ) {
                endGame();
                return;
            }

            // Increase score when passing pipes
            if (
                pipe_props.right < bird_props.left &&
                pipe_props.right + move_speed >= bird_props.left &&
                pipe.getAttribute("increase_score") === "1"
            ) {
                score_var.innerHTML = +score_var.innerHTML + 1;
                pipe.setAttribute("increase_score", "0");
            }

            // Move pipes left
            pipe.style.left = (pipe_props.left - move_speed) + "px";
        }
    });

    requestAnimationFrame(move);
}

// End the game
function endGame() {
    game_state = "End";
    message.innerHTML = "Game Over".fontcolor("red") + "<br>Press Enter to Restart";
    message.classList.add("message_style");
    img.style.display = "none";
    clearInterval(pipe_interval);
}

// Create pipes correctly
function create_pipe() {
    if (game_state !== "Play") return;

    let pipe_position = Math.floor(Math.random() * (background.height - 200 - pipe_gap)) + 100; 

    let pipe_top = document.createElement("div");
    pipe_top.className = "pipe";
    pipe_top.style.top = "0px";
    pipe_top.style.left = "100vw";
    pipe_top.style.height = pipe_position + "px";
    pipes_container.appendChild(pipe_top);

    let pipe_bottom = document.createElement("div");
    pipe_bottom.className = "pipe";
    pipe_bottom.style.top = (pipe_position + pipe_gap) + "px";
    pipe_bottom.style.left = "100vw";
    pipe_bottom.style.height = (background.height - pipe_position - pipe_gap) + "px";
    pipe_bottom.setAttribute("increase_score", "1");
    pipes_container.appendChild(pipe_bottom);
}
