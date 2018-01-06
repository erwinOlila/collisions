require('../css/style.css');
import { Circle } from './shapes'
import { Game } from './game'
import { Physics } from './physics'

let game: Game;
let circles: Circle[] = [];

window.onload = () => {
    preload();
    loop();
}

// load canvas and circle objects
let preload = (): void => {
    game    = new Game(800, 600);
    let i: number;
    let max: number = 50;
    circles = Physics.spawn(game, max, circles, 5, 10);
}

// start animation
let loop = (): void => {
    requestAnimationFrame(loop);
    game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
    for (let circle of circles) {
        circle.is_solid = true;
        Physics.collide(circle, circles);
        circle.draw();
    }
}



