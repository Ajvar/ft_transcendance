import "../../../styles/games.css";

declare global {
  interface HTMLElement {
    getContext: (contextId: "2d") => CanvasRenderingContext2D | null;
    height: number;
    width: number;
  }
}

enum KeyBindings {
  UP = 38,
  DOWN = 40,
  A = 65,
  Q = 81,
}

export class Game {
  private gameCanvas;
  private gameContext;
  private running: boolean = false;
  public static keysPressed: boolean[] = [];
  public static player1Score: number = 0;
  public static player2Score: number = 0;
  private player1: Paddle = new Paddle(0, 0, 0, 0);
  private player2: Paddle2 = new Paddle2(0, 0, 0, 0);
  private ball2: Ball = new Ball(5, 5, 5, 5);
  private ball: Ball = new Ball(0, 0, 0, 0);

  constructor(canvas: HTMLCanvasElement) {
    // Récupération de l'objet canvas
    this.gameCanvas = canvas;
    if (!this.gameCanvas) {
      console.error("Unable to find canvas element with id 'game-canvas'");
      return;
    }
    // Récupération du contexte du canvas
    this.gameContext = this.gameCanvas.getContext("2d");
    if (!this.gameContext) {
      console.error("Unable to get 2D context for canvas element");
      return;
    }
    // Initialisation de la police de caractères à utiliser pour dessiner le score
    this.gameContext.font = "30px Orbitron";

    // Initialisation des écouteurs d'événements pour gérer les entrées clavier
    window.addEventListener("keydown", function (e) {
      if (
        e.which === KeyBindings.A ||
        e.which === KeyBindings.Q ||
        e.which === KeyBindings.UP ||
        e.which === KeyBindings.DOWN
      ) {
        Game.keysPressed[e.which] = true;
      }
    });

    window.addEventListener("keyup", function (e) {
      if (
        e.which === KeyBindings.A ||
        e.which === KeyBindings.Q ||
        e.which === KeyBindings.UP ||
        e.which === KeyBindings.DOWN
      ) {
        Game.keysPressed[e.which] = false;
      }
    });

    // Initialisation des objets Paddle et Ball
    var paddleWidth: number = 20,
      paddleHeight: number = 60,
      ballSize: number = 10,
      wallOffset: number = 20;

    this.player1 = new Paddle(
      paddleWidth,
      paddleHeight,
      wallOffset,
      this.gameCanvas.height / 2 - paddleHeight / 2
    );
    this.player2 = new Paddle2(
      paddleWidth,
      paddleHeight,
      this.gameCanvas.width - (wallOffset + paddleWidth),
      this.gameCanvas.height / 2 - paddleHeight / 2
    );
    this.ball = new Ball(
      ballSize,
      ballSize,
      this.gameCanvas.width / 2 - ballSize / 2,
      this.gameCanvas.height / 2 - ballSize / 2
    );
    this.ball2 = new Ball(
      ballSize, 
      ballSize,
      this.gameCanvas.width / 2 - ballSize / 2,
    this.gameCanvas.height / 2 - ballSize / 2);
  }

  drawBoardDetails() {
    //draw les détails de la planche du jeu
    // draw le contour du terrain
    if (!this.gameContext) {
      return;
    }
    if (!this.gameCanvas) {
      return;
    }
    this.gameContext.strokeStyle = "#fff";
    this.gameContext.lineWidth = 5;
    this.gameContext.strokeRect(
      10,
      10,
      this.gameCanvas.width - 20,
      this.gameCanvas.height - 20
    );

    // draw les lignes centrales
    if (!this.gameCanvas) {
      return;
    }
    for (var i = 0; i + 30 < this.gameCanvas.height; i += 30) {
      this.gameContext.fillStyle = "#fff";
      this.gameContext.fillRect(this.gameCanvas.width / 2 - 10, i + 10, 15, 20);
    }
    //draw scores
    this.gameContext.fillText(Game.player1Score.toString(), 320, 50);
    this.gameContext.fillText(Game.player2Score.toString(), 450, 50);
  }

  // mettre à jour l'état du jeu
  update() {
    console.log("update called");
    if (!this.gameCanvas) {
      console.error("Unable to find gamecanvas element");
      return;
    }
    this.player1.update(this.gameCanvas);
    this.player2.update(this.gameCanvas);
    this.ball.update(this.player1, this.player2, this.gameCanvas);
  }
  updateSpeed() {
    console.log("updatespeed called");
    if (!this.gameCanvas) {
      console.error("Unable to find gamecanvas element");
      return;
    }
    this.player1.update(this.gameCanvas);
    this.player2.update(this.gameCanvas);
    this.ball.speedUpdate(this.player1, this.player2, this.gameCanvas);
  }
  update2Ball() {
    console.log("update2ball called");
    if (!this.gameCanvas) {
      console.error("Unable to find gamecanvas element");
      return;
    }
    this.player1.update(this.gameCanvas);
    this.player2.update(this.gameCanvas);
    this.ball.update(this.player1, this.player2, this.gameCanvas);
    this.ball2.update(this.player1, this.player2, this.gameCanvas);
  }
  draw2ball()
  {
    if (!this.gameContext) {
      return;
    }
    if (!this.gameCanvas) {
      return;
    }

    this.gameContext.fillStyle = "#000";
    this.gameContext.fillRect(
      0,
      0,
      this.gameCanvas.width,
      this.gameCanvas.height
    );

    this.drawBoardDetails();
    this.player1.draw(this.gameContext);
    this.player2.draw(this.gameContext);
    this.ball.draw(this.gameContext);
    this.ball2.draw(this.gameContext);
  }
  draw() {
    if (!this.gameContext) {
      return;
    }
    if (!this.gameCanvas) {
      return;
    }

    this.gameContext.fillStyle = "#000";
    this.gameContext.fillRect(
      0,
      0,
      this.gameCanvas.width,
      this.gameCanvas.height
    );

    this.drawBoardDetails();
    this.player1.draw(this.gameContext);
    this.player2.draw(this.gameContext);
    this.ball.draw(this.gameContext);
  }

  public start(): void {
    this.running = true;
    this.gameLoop();
  }

  public stop(): void {
    this.running = false;
  }
  public StartSpeed(): void {
    this.running = true;
    this.gameLoopSpeed();
  }

  public Start2Ball(): void {
    this.running = true;
    this.gameLoop2Ball();
  }

  public resetScore(): void {
    console.log("reset score");
    Game.player1Score = 0;
    Game.player2Score = 0;
  }

  private gameLoop(): void {

    console.log("gameLoop called1");
    if (this.running) {
      // mettre à jour l'état du jeu et dessiner le canvas
      this.update();
      this.draw();
      requestAnimationFrame(this.gameLoop.bind(this));
    }
  }

  private gameLoopSpeed(): void {

    console.log("gameLoopSpeed called");
    if (this.running) {
      // mettre à jour l'état du jeu et dessiner le canvas
      this.updateSpeed();
      this.draw();
      requestAnimationFrame(this.gameLoopSpeed.bind(this));
      if (Game.player1Score === 20 || Game.player2Score === 20)
      {
        this.stop();
      }
    }
  }
  private gameLoop2Ball(): void {

    console.log("gameLoop2ball called");
    if (this.running) {
      // mettre à jour l'état du jeu et dessiner le canvas
      this.update2Ball();
      this.draw2ball();
      requestAnimationFrame(this.gameLoop2Ball.bind(this));
      if (Game.player1Score === 20 || Game.player2Score === 20)
      {
        this.stop();
      }
    }
  }
}

class Entity {
  width: number;
  height: number;
  x: number;
  y: number;
  xVel: number = 0;
  yVel: number = 0;
  constructor(w: number, h: number, x: number, y: number) {
    this.width = w;
    this.height = h;
    this.x = x;
    this.y = y;
  }
  draw(context: CanvasRenderingContext2D) {
    context.fillStyle = "#fff";
    context.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Paddle extends Entity {
  public speed: number = 7;

  update(canvas: HTMLElement) {
    if (Game.keysPressed[KeyBindings.UP]) {
      this.yVel = -1;
      if (this.y <= 20) {
        this.yVel = 0;
      }
    } else if (Game.keysPressed[KeyBindings.DOWN]) {
      this.yVel = 1;
      if (this.y + this.height >= canvas.height - 20) {
        this.yVel = 0;
      }
    } else {
      this.yVel = 0;
    }

    this.y += this.yVel * this.speed;
  }
}

class Paddle2 extends Paddle {
  update(canvas: HTMLElement) {
    if (Game.keysPressed[KeyBindings.A]) {
      this.yVel = -1;
      if (this.y <= 20) {
        this.yVel = 0;
      }
    } else if (Game.keysPressed[KeyBindings.Q]) {
      this.yVel = 1;
      if (this.y + this.height >= canvas.height - 20) {
        this.yVel = 0;
      }
    } else {
      this.yVel = 0;
    }
    this.y += this.yVel * this.speed;
  }
}



class Ball extends Entity {
  private speed: number = 3;

  constructor(w: number, h: number, x: number, y: number) {
    super(w, h, x, y);
    var randomDirection = Math.floor(Math.random() * 2) + 1;
    if (randomDirection % 2) {
      this.xVel = 1;
    } else {
      this.xVel = -1;
    }
    this.yVel = 1;
  }

  update(player1: Paddle, player2: Paddle2, canvas: HTMLElement) {
    //vérifier les limites du canvas supérieur
    if (this.y <= 10) {
      this.yVel = 1;
    }
    //vérifier les limites inférieures du canvas
    if (this.y + this.height >= canvas.height - 10) {
      this.yVel = -1;
    }
    //vérifier les limites du canvas gauche et score+1
    if (this.x <= 0) {
      this.x = canvas.width / 2 - this.width / 2;
      Game.player2Score += 1;
    }
    //vérifier les limites du canvas droit et score+1
    if (this.x + this.width >= canvas.width) {
      this.x = canvas.width / 2 - this.width / 2;
      Game.player1Score += 1;
    }
    //vérifier la collision player1
    if (this.x <= player1.x + player1.width) {
      if (
        this.y >= player1.y &&
        this.y + this.height <= player1.y + player1.height
      ) {
        this.xVel = 1;
      }
    }
    //vérifier la collision player2
    if (this.x + this.width >= player2.x) {
      if (
        this.y >= player2.y &&
        this.y + this.height <= player2.y + player2.height
      ) {
        this.xVel = -1;
      }
    }
    this.x += this.xVel * this.speed;
    this.y += this.yVel * this.speed;
  }

  speedUpdate(player1: Paddle, player2: Paddle2, canvas: HTMLElement) {
    //vérifier les limites du canvas supérieur
    if (this.y <= 10) {
      this.yVel = 1;
    }
    //vérifier les limites inférieures du canvas
    if (this.y + this.height >= canvas.height - 10) {
      this.yVel = -1;
    }
    //vérifier les limites du canvas gauche et score+1
    if (this.x <= 0) {
      this.x = canvas.width / 2 - this.width / 2;
      Game.player2Score += 1;
      
    }
    //vérifier les limites du canvas droit et score+1
    if (this.x + this.width >= canvas.width) {
      this.x = canvas.width / 2 - this.width / 2;
      Game.player1Score += 1;
    }
    //vérifier la collision player1
    if (this.x <= player1.x + player1.width) {
      if (
        this.y >= player1.y &&
        this.y + this.height <= player1.y + player1.height
      ) {
        this.xVel = 1;
        this.speed += 1;
      }
    }
    //vérifier la collision player2
    if (this.x + this.width >= player2.x) {
      if (
        this.y >= player2.y &&
        this.y + this.height <= player2.y + player2.height
      ) {
        this.xVel = -1;
        this.speed += 1;
      }
    }
    this.x += this.xVel * this.speed;
    this.y += this.yVel * this.speed;
  }
}