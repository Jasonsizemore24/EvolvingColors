const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.downloadAll(() => {
    const canvas = document.getElementById("gameWorld");
    const ctx = canvas.getContext("2d");

    gameEngine.init(ctx);

    // Add some initial plants and animats
    for (let i = 0; i < gameEngine.gridSize; i++) {
        for (let j = 0; j < gameEngine.gridSize; j++) {
            if (Math.random() < 0.05) {
                const hue = Math.random() * 360;
                const plant = new Plant(gameEngine, i, j, hue);
                gameEngine.addEntity(plant);
            }
            if (Math.random() < 0.02) {
                const hue = Math.random() * 360;
                const animat = new Animat(gameEngine, i, j, hue);
                gameEngine.addEntity(animat);
            }
        }
    }

    document.getElementById("startBtn").addEventListener("click", () => {
        gameEngine.running = true;
    });

    document.getElementById("pauseBtn").addEventListener("click", () => {
        gameEngine.running = false;
    });

    document.getElementById("resetBtn").addEventListener("click", () => {
        gameEngine.init(ctx);
        gameEngine.entities = [];
        gameEngine.entitiesGrid = Array.from({ length: gameEngine.gridSize }, () => Array(gameEngine.gridSize).fill(null));
        // Add initial plants and animats again
        for (let i = 0; i < gameEngine.gridSize; i++) {
            for (let j = 0; j < gameEngine.gridSize; j++) {
                if (Math.random() < 0.05) {
                    const hue = Math.random() * 360;
                    const plant = new Plant(gameEngine, i, j, hue);
                    gameEngine.addEntity(plant);
                }
                if (Math.random() < 0.02) {
                    const hue = Math.random() * 360;
                    const animat = new Animat(gameEngine, i, j, hue);
                    gameEngine.addEntity(animat);
                }
            }
        }
    });

    document.getElementById("updateSpeed").addEventListener("input", (event) => {
        const speed = 100 - event.target.value; // Adjusting speed 
        gameEngine.setUpdateSpeed(speed);
    });

    gameEngine.start();
});