import { Point } from "./game";
import GameObject from "./gameObject";

export default class Pixel extends GameObject {
    public direction:Point = {x: 5, y: 5};
    public velocity = 2;
    public linearDrag = 0.03;

    constructor(id: string, position: Point, color = '0xFFFFFFFF') {
        super();
        this.id = id;
        this.position = position;
        this.color = parseInt(color, 16);
        this.linearDrag = Math.random() * 0.02 + 0.01;
        return this;
    }

    public onUpdate() {
        console.log(this.id, this.position.x, this.position.y);
    }
}