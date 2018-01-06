interface Shape {
    x: number;
    y: number;
    radius: number;
    color: number;
    dx: number;
    dy: number;
    is_solid: boolean;
    draw(): void;
    update(): void;
}

export const colors: Array<string> = [
    'rgba(46, 17, 45, 1)',
    'rgba(84, 0, 50, 1)',
    'rgba(130, 3, 51, 1)',
    'rgba(201, 40, 62, 1)',
    'rgba(240, 67, 55, 1)',
    'rgba(227, 27, 157, 1)',
    'rgba(240, 202, 77, 1)',
    'rgba(245, 73, 55, 77)',
]

export class Circle implements Shape {
    is_solid: boolean;
    color: number;
    constructor(
        public x: number, 
        public y: number, 
        public dx: number,
        public dy: number,
        public radius: number, 
        public mass: number, 
        private ctx: CanvasRenderingContext2D) {
            this.is_solid = false;
            this.color = 0;
         }

    draw = (): void => {
        this.ctx.beginPath();
        this.ctx.fillStyle = colors[this.color];
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        this.ctx.fill();
        this.update();
    }

    update = (): void => {

        // resolve collision against borders
        this.dx = ((this.x + this.radius > innerWidth || this.x - this.radius < 0 ) ? -this.dx : this.dx);
        this.dy = ((this.y + this.radius > innerHeight || this.y - this.radius < 0 ) ? -this.dy : this.dy);
        this.x += this.dx;
        this.y += this.dy;
    }
}