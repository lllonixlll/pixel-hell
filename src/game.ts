import GameObject from "./gameObject";
import Pixel from "./pixel";

export enum GameStatus {
    Active,
    Inactive
}

enum Action {
    Swallow = "Swallow",
    Push = "Push"
}

export type Point = {
    x: number,
    y: number
}

export default class Game {
    public status: GameStatus = GameStatus.Inactive;
    public ctx: CanvasRenderingContext2D;
    public imageData:ImageData; 
    public imageData32:Uint32Array; 
    public canvas: HTMLCanvasElement;
    public screen = { width: 800, height: 600 };
    public gameObjects: Array<GameObject>;
    public layers: Array<Array<GameObject>>;
    public fpsLimit = 1000 / 60;
    // public fpsLimit = 0;
    public maxPixels = 100000;
    public mouse: Point = { x: 0, y: 0 };
    public mouseAction: Action = Action.Push;
    public deltaTime = 0;
    public fps = {
        total: 0,
        counter: 0,
        timeLeft: 0
    };

    private deltaTimeTimestamp = 0;

    constructor(canvasId: string) {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.gameObjects = new Array<GameObject>();
        this.layers = new Array<Array<GameObject>>();
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.screen.width = window.innerWidth;
        this.screen.height = window.innerHeight;
        this.deltaTime = 0;
        this.deltaTimeTimestamp = Date.now();

        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.imageData = this.ctx.createImageData(this.screen.width, this.screen.height);
        this.imageData32 = new Uint32Array(this.imageData.data.buffer);

        document.onmousemove = (event: MouseEvent) => {
            this.mouse = { x: event.pageX, y: event.pageY };
        }

        document.onmousedown = (event: MouseEvent) => {
            switch (event.button) {
                case 2: // Right click
                    const enumList = Object.keys(Action);
                    this.mouseAction = enumList.indexOf(this.mouseAction) + 1 < enumList.length ?
                        enumList[enumList.indexOf(this.mouseAction) + 1] as Action :
                        enumList[0] as Action;
                    break;
            }
        }

        // Disable dropdown menu on right click
        document.addEventListener('contextmenu', event => event.preventDefault());
    }

    public loop() {
        if (this.status == GameStatus.Active) {
            // Main loop logic
            this.clearScreen();
            this.drawObjects();

            for (let i = 0; i < this.gameObjects.length; i++) {
                let pxl = this.gameObjects[i] as Pixel;
                const nextPos: Point = {
                    x: pxl.position.x + pxl.direction.x * pxl.velocity,
                    y: pxl.position.y + pxl.direction.y * pxl.velocity
                };

                if (nextPos.x > this.screen.width) {
                    pxl.position.x = this.screen.width;
                    pxl.direction.x *= -1.1 + Math.random() * 0.2;
                }
                if (nextPos.x < 0) {
                    pxl.position.x = 0;
                    pxl.direction.x *= -1.1 + Math.random() * 0.2;
                }
                if (nextPos.y > this.screen.height) {
                    pxl.position.y = this.screen.height;
                    pxl.direction.y *= -1.1 + Math.random() * 0.2;
                }
                if (nextPos.y < 0) {
                    pxl.position.y = 0;
                    pxl.direction.y *= -1.1 + Math.random() * 0.2;
                }

                pxl.position.x += pxl.direction.x * pxl.velocity;
                pxl.position.y += pxl.direction.y * pxl.velocity;
                pxl.velocity -= pxl.linearDrag * pxl.velocity;

                const dir: Point = { x: pxl.position.x - this.mouse.x, y: pxl.position.y - this.mouse.y };
                const dist = Math.sqrt(Math.pow(dir.x, 2) + Math.pow(dir.y, 2))
                const dirNormalized: Point = { x: dir.x / dist, y: dir.y / dist };

                if (dist < 100 && dist > 10) {
                    pxl.direction = { x: dir.x, y: dir.y };
                    switch (this.mouseAction) {
                        case Action.Push:
                            pxl.velocity += dist / 100 * 0.01;
                            break;
                        case Action.Swallow:
                            pxl.velocity -= dist / 100 * 0.05;
                            break;
                    }
                }

                // console.log(dist, pxl.position.x, pxl.position.y, dirNormalized, pxl.velocity);
                //obj.onUpdate();
            };

            this.ctx.fillStyle = 'rgb(100, 100, 100)';
            this.ctx.font = '20px arial bold';
            this.ctx.fillText("FPS: " + this.fps.total, 10, 20);
            this.ctx.fillText("Stars: " + this.gameObjects.length.toString(), 10, 40);
            this.ctx.fillText("Action: " + this.mouseAction.toString(), 10, 60);


            // this.ctx.fillStyle = 'rgb(0, 0, 0)';
            // this.ctx.font = '200px arial';
            // this.ctx.fillText('FUCK YOU', this.screen.width / 2 - 600, this.screen.height / 2 + 70);
        }

        this.deltaTime = Date.now() - this.deltaTimeTimestamp;
        this.fps.timeLeft += this.deltaTime;
        this.deltaTimeTimestamp = Date.now();
        this.fps.counter++;

        if (this.fps.timeLeft >= 1000) {
            this.fps.total = this.fps.counter;
            this.fps.timeLeft = 0;
            this.fps.counter = 0;
        }

        setTimeout(() => this.loop(), this.fpsLimit - this.deltaTime);
    }

    public start() {
        console.log('Game Started');
        this.status = GameStatus.Active;
        this.loop();

        for (let i = 0; i < this.maxPixels; i++) {
            this.createPixel();
        }
    }

    public stop() {
        console.log('Game Stopped');
        this.status = GameStatus.Inactive;
    }

    public clearScreen() {
        this.ctx.fillStyle = 'rgb(0, 0, 0)';
        this.ctx.fillRect(0, 0, this.screen.width, this.screen.height);
        this.imageData32.fill(0x00000000);
    }

    public drawObjects() {
        for (let i = 0; i < this.gameObjects.length; i++) {
            const obj = this.gameObjects[i];
            this.imageData32[Math.floor(obj.position.x) + Math.floor(obj.position.y) * this.screen.width] = obj.color;
        }

        this.ctx.putImageData(this.imageData, 0, 0);
    }

    public addObject(gameObject: GameObject) {
        if (!this.layers[gameObject.layer]) {
            this.layers[gameObject.layer] = new Array<GameObject>();
        }
        this.layers[gameObject.layer].push(gameObject);
        this.gameObjects.push(gameObject);
    }

    public createPixel(): Pixel | null {
        if (this.gameObjects.length < this.maxPixels) {
            const newPxl: Pixel = new Pixel(
                'pixel' + (this.gameObjects.length + 1),
                {
                    x: Math.random() * this.screen.width,
                    y: Math.random() * this.screen.height,
                }
            );
            const color = Math.min(Math.round(this.gameObjects.length / this.maxPixels * 200) + 55, 255).toString(16);
            newPxl.color = parseInt('0xFF' + color + color + color);
            newPxl.direction.x = -1 + Math.random() * 2;
            newPxl.direction.y = -1 + Math.random() * 2;
            this.addObject(newPxl);
            return newPxl;
        }

        return null;
    }
}