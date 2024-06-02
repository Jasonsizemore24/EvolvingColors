class GameEngine {
    constructor(options) {
        // What you will use to draw
        // Documentation: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
        this.ctx = null;

        // Everything that will be updated and drawn each frame
        this.entities = [];

        // Information on the input
        this.click = null;
        this.mouse = null;
        this.wheel = null;
        this.keys = {};

        this.gridSize = 40; // NxN grid
        this.cellSize = 20; // Size of each cell in pixels
        this.entitiesGrid = []; // Grid to store entities
        this.updateSpeed = 100; // in milliseconds
        this.lastUpdateTime = 0; // to keep track of last update time

        // Options and the Details
        this.options = options || {
            debugging: false,
        };
    };

    setUpdateSpeed(speed) {
        this.updateSpeed = speed;
    }

    init(ctx) {
        this.ctx = ctx;
        this.startInput();
        this.timer = new Timer();

        // Initialize the entities grid
        for (let i = 0; i < this.gridSize; i++) {
            this.entitiesGrid[i] = [];
            for (let j = 0; j < this.gridSize; j++) {
                // Initialize with null indicating no entity in the cell
                this.entitiesGrid[i][j] = null;
            }
        }
    };

    start() {
        this.running = true;
        const gameLoop = (timestamp) => {
            if (this.running) {
                if (timestamp - this.lastUpdateTime >= this.updateSpeed) {
                    this.lastUpdateTime = timestamp;
                    this.update();
                    this.draw();
                }
                requestAnimationFrame(gameLoop);
            }
        };
        requestAnimationFrame(gameLoop);
    };

    startInput() {
        const getXandY = e => ({
            x: e.clientX - this.ctx.canvas.getBoundingClientRect().left,
            y: e.clientY - this.ctx.canvas.getBoundingClientRect().top
        });
        
        this.ctx.canvas.addEventListener("mousemove", e => {
            if (this.options.debugging) {
                console.log("MOUSE_MOVE", getXandY(e));
            }
            this.mouse = getXandY(e);
        });

        this.ctx.canvas.addEventListener("click", e => {
            if (this.options.debugging) {
                console.log("CLICK", getXandY(e));
            }
            this.click = getXandY(e);
        });

        this.ctx.canvas.addEventListener("wheel", e => {
            if (this.options.debugging) {
                console.log("WHEEL", getXandY(e), e.wheelDelta);
            }
            e.preventDefault(); // Prevent Scrolling
            this.wheel = e;
        });

        this.ctx.canvas.addEventListener("contextmenu", e => {
            if (this.options.debugging) {
                console.log("RIGHT_CLICK", getXandY(e));
            }
            e.preventDefault(); // Prevent Context Menu
            this.rightclick = getXandY(e);
        });

        this.ctx.canvas.addEventListener("keydown", event => this.keys[event.key] = true);
        this.ctx.canvas.addEventListener("keyup", event => this.keys[event.key] = false);
    };

    addEntity(entity) {
        this.entities.push(entity);
        this.entitiesGrid[entity.x][entity.y] = entity;
    };

    updateEntities() {
        // Update all entities
        for (const entity of this.entities) {
            entity.update();
        }
    }

    drawEntities() {
        // Draw all entities
        for (const entity of this.entities) {
            entity.draw(this.ctx);
        }
    }

    draw() {
        // Clear the whole canvas with transparent color (rgba(0, 0, 0, 0))
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        // Draw latest things first
        for (let i = this.entities.length - 1; i >= 0; i--) {
            this.entities[i].draw(this.ctx, this);
        }
    };

    update() {
        let entitiesCount = this.entities.length;
    
        for (let i = 0; i < entitiesCount; i++) {
            let entity = this.entities[i];
    
            if (!entity.removeFromWorld) {
                entity.update();
            }
        }
    
        for (let i = this.entities.length - 1; i >= 0; --i) {
            if (this.entities[i].removeFromWorld) {
                this.entitiesGrid[this.entities[i].x][this.entities[i].y] = null;
                this.entities.splice(i, 1);
            }
        }
    };

    loop() {
        if (this.running) {
            this.clockTick = this.timer.tick();
            this.update();
            this.draw();
        }
        requestAnimFrame(() => this.loop(), this.ctx.canvas);
    }
};