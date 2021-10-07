import { Point } from "./game";

export default class GameObject {
    public id: string;
    public layer: number;
    public position: Point;
    public color: number;

    constructor() {
        this.id = '';
        this.layer = 0;
        this.position = {
            x: 0,
            y: 0
        };
        this.color = parseInt('0xFFFFFFFF', 16);
    }

    public onUpdate() {

    }
}