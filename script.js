const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const img = new Image();
img.src = "./media/flappy-bird-set2.png";

// general settingssss
let gamePlaying = false;
const gravity = 0.5;
const speed = 6.2;
const size = [51, 36];
const jump = -11.5;
const cTenth = canvas.width / 10;

// pipe settingssss
const pipeWidth = 78; 
const pipeGap = 270;
const pipeLoc = () => (Math.random () * ((canvas.height - (pipeGap + pipeWidth)) - pipeWidth)) + pipeWidth; 

let index = 0,
  bestScore = 0,
  currentScore = 0,
  pipes = [],
  flight,
  flyHeight;

  const setUp = () => {
    currentScore = 0;
    flight = jump;
    flyHeight = (canvas.height / 2) - (size[1] / 2);
    pipes = Array(3).fill().map((a, i) => [canvas.width + (i * (pipeGap + pipeWidth)),pipeLoc()]);

  }

const render = () => {
  index++;

  // background
  ctx.drawImage(
    img,
    0,
    0,
    canvas.width,
    canvas.height,
    -((index * (speed / 2)) % canvas.width) + canvas.width,
    0,
    canvas.width,
    canvas.height
  );
  ctx.drawImage(
    img,
    0,
    0,
    canvas.width,
    canvas.height,
    -((index * (speed / 2)) % canvas.width),
    0,
    canvas.width,
    canvas.height
  );

  if (gamePlaying) {
    ctx.drawImage(
      img,
      432,
      Math.floor((index % 9) / 3) * size[1],
      ...size,
      cTenth,
      flyHeight,
      ...size
    );

    flyHeight = Math.min(flyHeight + flight, canvas.height - size[1]);
    flight += gravity;
  } else {
    // bird
    ctx.drawImage(
      img,
      432,
      Math.floor((index % 9) / 3) * size[1],
      ...size,
      canvas.width / 2 - size[0] / 2,
      flyHeight,
      ...size
    );
    flyHeight = canvas.height / 2 - size[1] / 2;

    ctx.fillText(`Meilleur score : ${bestScore}`, 55, 245);
    ctx.fillText("Cliquez pour jouer", 48, 535);
    ctx.font = "bold 30px courier";
  }

  if(gamePlaying) {
    pipes.map(pipe => {
      pipe[0] -= speed; 

      //botton pipe
      ctx.drawImage(img, 432 + pipeWidth, 108, pipeWidth, canvas.height - pipe[1] + pipeGap, pipe[0],pipe [1] + pipeGap, pipeWidth, canvas.height - pipe[1] + pipeGap); 

      //top pipe 
      ctx.drawImage(img, 432, 588 - pipe[1], pipeWidth, pipe[1], pipe[0], 0, pipeWidth, pipe[1]); 

      if(pipe[0] <= - pipeWidth) {
        currentScore++;
        bestScore = Math.max(bestScore, currentScore); 

        // remove pipe plus create new one 
        pipes = [...pipes.slice(1), [pipes[pipes.length-1][0]+ pipeGap + pipeWidth, pipeLoc()]];
      }
      // if hit the pipe ENDDD
      if([

        pipe[0] <= cTenth + size[0],
        pipe[0] + pipeWidth >= cTenth, 
        pipe[1] > flyHeight || pipe[1] + pipeGap < flyHeight + size[1]
      ].every(elem => elem)) {
        gamePlaying = false; 
        setUp();
      }
    })
  }

  document.getElementById('bestScore').innerHTML = `Meilleur: ${bestScore}`; 
  document.getElementById('currentScore').innerHTML = `Actuel: ${currentScore}`
  window.requestAnimationFrame(render);
};

setUp(); 
img.onload = render;
document.addEventListener("click", () => (gamePlaying = true));
window.onclick = () => (flight = jump);
