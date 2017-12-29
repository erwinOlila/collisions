require('../css/style.css');
import { Greet } from './greet'

let g = <HTMLElement>document.getElementById('greet');
g.innerHTML = `<span style="color:red;">${Greet.greet}</span>`;


