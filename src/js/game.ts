interface Params {
    width: number,
    height: number
}

export class Game implements Params {
    public canvas: HTMLCanvasElement;
    public ctx   : CanvasRenderingContext2D;

    constructor (public width: number, public height: number) {
        this.canvas = <HTMLCanvasElement>document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d")!;

        innerWidth  = this.width;
        innerHeight = this.height;
        
        let attribute: string[][] = [
            ["height", this.height.toString()],
            ["width",  this.width.toString()]
        ]
        
        for (let [elem, set] of attribute) {
            this.canvas.setAttribute(elem, set);
        }

        console.log('Canvas loaded in ' +this.width.toString()+' by '+ this.height.toString());
    }
}