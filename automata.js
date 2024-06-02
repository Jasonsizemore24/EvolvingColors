class Automata {
    constructor(game, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.age = 0;
        this.removeFromWorld = false;
    }

    update() {
        this.age++;
        if (Math.random() < 0.01) this.removeFromWorld = true;
    }

    draw(ctx) {
        
    }
}

class Plant extends Automata {
    constructor(game, x, y, hue) {
        super(game, x, y);
        this.hue = hue;
    }

    update() {
        super.update();
        // Grow a new plant if mature
        if (this.age > 100 && Math.random() < 0.1) {
            const directions = [
                { dx: -1, dy: 0 },
                { dx: 1, dy: 0 },
                { dx: 0, dy: -1 },
                { dx: 0, dy: 1 },
            ];
            const dir = directions[Math.floor(Math.random() * directions.length)];
            const newX = (this.x + dir.dx + this.game.gridSize) % this.game.gridSize;
            const newY = (this.y + dir.dy + this.game.gridSize) % this.game.gridSize;
            if (!this.game.entitiesGrid[newX][newY]) {
                const newHue = (this.hue + (Math.random() * 20 - 10)) % 360;
                const newPlant = new Plant(this.game, newX, newY, newHue);
                this.game.addEntity(newPlant);
            }
        }
    }

    draw(ctx) {
        ctx.fillStyle = `hsl(${this.hue}, 100%, 50%)`;
        ctx.beginPath();
        ctx.arc(this.x * this.game.cellSize + this.game.cellSize / 2, this.y * this.game.cellSize + this.game.cellSize / 2, this.game.cellSize / 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Animat extends Automata {
    constructor(game, x, y, hue) {
        super(game, x, y);
        this.hue = hue;
        this.energy = 100;
    }

    update() {
        super.update();

        // Move to an adjacent cell with color closest to their own
        const directions = [
            { dx: -1, dy: 0 },
            { dx: 1, dy: 0 },
            { dx: 0, dy: -1 },
            { dx: 0, dy: 1 },
        ];
        let bestDirection = null;
        let bestHueDifference = Infinity;

        for (const dir of directions) {
            const newX = (this.x + dir.dx + this.game.gridSize) % this.game.gridSize;
            const newY = (this.y + dir.dy + this.game.gridSize) % this.game.gridSize;
            const entity = this.game.entitiesGrid[newX][newY];
            if (entity instanceof Plant) {
                const hueDifference = Math.abs(entity.hue - this.hue);
                if (hueDifference < bestHueDifference) {
                    bestHueDifference = hueDifference;
                    bestDirection = dir;
                }
            }
        }

        if (bestDirection) {
            this.x = (this.x + bestDirection.dx + this.game.gridSize) % this.game.gridSize;
            this.y = (this.y + bestDirection.dy + this.game.gridSize) % this.game.gridSize;
            const plant = this.game.entitiesGrid[this.x][this.y];
            if (plant instanceof Plant) {
                const hueDifference = Math.abs(plant.hue - this.hue);
                this.energy += (50 - hueDifference) / 10;
                plant.removeFromWorld = true;
                this.game.entitiesGrid[this.x][this.y] = null;
            }
        }

        // Reproduce if energy is high
        if (this.energy > 200) {
            const newHue = (this.hue + (Math.random() * 20 - 10)) % 360;
            const newAnimat = new Animat(this.game, this.x, this.y, newHue);
            this.game.addEntity(newAnimat);
            this.energy -= 100;
        }

        // Lose energy over time
        this.energy -= 0.1;
        if (this.energy <= 0) this.removeFromWorld = true;
    }

    draw(ctx) {
         ctx.fillStyle = "white";
        ctx.fillRect(this.x * this.game.cellSize, this.y * this.game.cellSize, this.game.cellSize, this.game.cellSize);
    }
}