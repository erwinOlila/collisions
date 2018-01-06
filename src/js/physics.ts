import { Circle, colors } from './shapes'
import { Game } from './game'


const PI: number = Math.PI;

export class Physics {
    constructor () {
    }

    public static spawn = (game: Game, max: number, circles: Array<Circle>, rad_min: number, rad_max: number): Array<Circle> => {
        let i: number;

        // Avoid collision at initial location
        for (i = 0; i < max; i++) {
            let radius: number = Physics.random(rad_min, rad_max);
            let dummy: Circle = new Circle (
                Physics.random(radius, innerWidth-radius),
                Physics.random(radius, innerHeight-radius),
                Physics.random(-3, 3),
                Physics.random(-3, 3),
                radius,
                radius,
                game.ctx
            )

            // Avoid resolving to self
            if (i !== 0) {
                let j: number;
                for (j = 0; j < circles.length; j++) {
                    if (Physics.touch(dummy, circles[j])) {
                        dummy.x = Physics.random(radius, innerWidth-radius);
                        dummy.y = Physics.random(radius, innerHeight-radius);
                              j = -1; // reset to j = 0
                    }
                }
            }
            circles.push(dummy);
        }

        return circles;
    }

    public static collide = (obj: Circle, circles: Array<Circle>): void => {
        if (obj.is_solid) {
            for (let circle of circles) {
                if (obj === circle) continue;
                if (Physics.touch(obj, circle)) {
                    Physics.resolve_collision(obj, circle);
                    obj.color = Math.floor (Physics.random(0, colors.length));
                }
            }
        }
    }

    private static resolve_collision = (circle_1: Circle, circle_2: Circle): void => {
        const vx_1: number =  circle_1.dx;
        const vx_2: number =  circle_2.dx;
        const vy_1: number =  circle_1.dy;
        const vy_2: number =  circle_2.dy;
        const damping: number = 0.90;

        const velDiff_x: number = vx_1 - vx_2;
        const velDiff_y: number = vy_1 - vy_2;

        const xdt = circle_2.x - circle_1.x;
        const ydt = circle_2.y -(circle_1.y);

        // Avoids overlap
        if(ydt*velDiff_y + xdt*velDiff_x >= 0) {

            // Take the magnitude of each circles velocity
            const magV1: number = Math.sqrt(vx_1 * vx_1 + vy_1 * vy_1);
            const magV2: number = Math.sqrt(vx_2 * vx_2 + vy_2 * vy_2);

            const m1: number = circle_1.mass;
            const m2: number = circle_2.mass;

            // The angles in this stage are based in canvas' orientation
            let theta_1: number = Math.atan2(vy_1, vx_1);
            let theta_2: number = Math.atan2(vy_2, vx_2);
            let phi    : number = Math.atan2(ydt, xdt);

            // Resolve the angles into cartesian coordinate orientation
            // The angles must be based on counter clockwise direction with +x axis as the
            // terminal axis
            // This includes scaling the canvas' y axis by negative value
            theta_1 = Physics.resolveAngle(vx_1, vy_1, theta_1);
            theta_2 = Physics.resolveAngle(vx_2, vy_2, theta_2);
            phi     = Physics.resolveAngle(xdt, ydt, phi);

            // Solving for velocities
            // These equations compute the objects' velocities after collision in two
            // dimensions by one dimension resolution.
            // Basically, collisons in t2o dimensions can be analyzed in one dimension
            // orientation by rotating the x and y axis to be parallel with the contact
            // angle and then rotate back ot get its original x and y components
            // source: https://en.wikipedia.org/wiki/Elastic_collision
            const nvx1 = ((((magV1*Math.cos(theta_1 - phi))*(m1-m2))
                        + (2*m2*magV2*Math.cos(theta_2-phi)))*Math.cos(phi)/(m1+m2))
                        + (magV1*Math.sin(theta_1 - phi))*Math.cos(phi + (PI/2));

            const nvy1 = ((((magV1*Math.cos(theta_1 - phi))*(m1-m2))
                        + (2*m2*magV2*Math.cos(theta_2-phi)))*Math.sin(phi)/(m1+m2))
                        + (magV1*Math.sin(theta_1 - phi))*Math.sin(phi + (PI/2));

            const nvx2 = ((((magV2*Math.cos(theta_2 - phi))*(m2-m1))
                        + (2*m1*magV1*Math.cos(theta_1-phi)))*Math.cos(phi)/(m1+m2))
                        + (magV2*Math.sin(theta_2 - phi))*Math.cos(phi + (PI/2));

            const nvy2 = ((((magV2*Math.cos(theta_2 - phi))*(m2-m1))
                        + (2*m1*magV1*Math.cos(theta_1-phi)))*Math.sin(phi)/(m1+m2))
                        + (magV2*Math.sin(theta_2 - phi))*Math.sin(phi + (PI/2));

            circle_1.dx =  nvx1 * damping;
            circle_1.dy = -nvy1 * damping; // scale the y axis back into canvas' y axis orientation

            circle_2.dx =  nvx2 * damping;
            circle_2.dy = -nvy2 * damping; // scale the y axis back into canvas' y axis orientation

        }
    }

    private static resolveAngle = (x: number, y: number, theta: number): number => {
        if(theta < 0) {
          if (y < 0) {
            return (-theta);  // Q4 -> Q1
          } else {
            return (PI - theta);  // Q2 -> Q3
          }
        } else {
          if (y < 0) {
            return PI - theta;  // Q3 -> Q2
          } else {
            return (2*PI - theta); // Q1 -> Q4
          }
        }
      }

    private static random = (min: number, max: number): number => {
        return Math.random()* (max - min) + min;
    }

    private static touch = (obj_1: Circle, obj_2: Circle): boolean => {
        let x_dis: number = obj_1.x - obj_2.x;
        let y_dis: number = obj_1.y - obj_2.y;

        return (Math.sqrt(x_dis * x_dis+ y_dis * y_dis) < (obj_1.radius + obj_2.radius))
    }
}