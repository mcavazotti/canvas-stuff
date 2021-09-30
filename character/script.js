
function initGame() {
    // set up variables
    gameController.canvas = document.getElementById("game");
    gameController.context = gameController.canvas.getContext("2d");
    gameController.canvasSize = [gameController.canvas.width, gameController.canvas.height];
    gameController.player = createGameObject(0, 0, 0, renderPlayer(), updatePlayer, createPlayerData())
    gameController.camera.aspectRatio = gameController.canvasSize[1] / gameController.canvasSize[0];
    gameController.camera.frustrumHeight = gameController.camera.frustrumWidth * gameController.camera.aspectRatio;

    var worldTopLeft = [-15, 15];
    var worldBottomRight = [15, -15];

    worldData.topLeft = worldTopLeft;
    worldData.bottomRight = worldBottomRight;
    worldData.renderTopLeft = vectorAdd(worldTopLeft, [-2, 2]);
    worldData.renderBottomRight = vectorAdd(worldBottomRight, [2, -2]);
    worldData.renderBg = renderFixedGrid(worldData.renderTopLeft, worldData.renderBottomRight, 5, '#00000044', '#fdfcdc', 1, [0.5, 0.5]);

    // set up functions
    gameController.clear = () => {
        gameController.context.clearRect(0, 0, gameController.canvasSize[0], gameController.canvasSize[1]);
    };

    gameController.render = () => {
        //render background
        worldData.renderBg({}, gameController.camera, gameController.canvasSize, gameController.context);
        // render player
        gameController.player.render(gameController.player.transform, gameController.camera, gameController.canvasSize, gameController.context);

        for (const obj of gameController.objects) {
            obj.render(obj.transform, gameController.camera, gameController.canvasSize, gameController.context);
        }
    };

    gameController.updateObjects = () => {
        // update player
        gameController.player.update(gameController.player.data);

        // update objects 
        var deleteObjects = [];
        for (const obj of gameController.objects) {
            obj.update();
            if (obj.markedForRemoval) {
                deleteObjects.push(obj);
            }
        }
        for (const obj of deleteObjects) {
            gameController.objects.delete(obj);
        }
    };


    // render inital screen
    gameController.render();
    gameController.context.fillStyle = '#00000099';
    gameController.context.font = '48px Arial';
    var textSize = gameController.context.measureText("Click to start");
    gameController.context.fillText("Click to start", (gameController.canvasSize[0] - textSize.width) / 2, gameController.canvasSize[1] / 2);
}

function startGame() {
    if (!gameController.gameRunning) {
        gameController.gameRunning = true;
        var lastTimestamp = performance.now();
        setInterval(() => {
            var curTimestamp = performance.now();
            gameController.realFps = 1000 / (curTimestamp - lastTimestamp);
            lastTimestamp = curTimestamp;
            gameController.updateObjects();
            gameController.clear();
            gameController.render();
        }, 1000 / gameController.targetFps);
    }
}

function getMousePosition(event) {
    var rect = gameController.canvas.getBoundingClientRect();
    inputValues.mousePos = [event.clientX - rect.left, event.clientY - rect.top];
}

function getMouseDown(event) {
    // event.preventDefault();
    switch (event.button) {
        case 0:
            inputValues.mouseLeftDown = true;
            break;
        case 1:
            inputValues.mouseMiddleDown = true;
            break;
        case 2:
            inputValues.mouseRightDown = true;
            break;
        default:
            console.error(`Unknown button code: ${event.button}`);
    }
}

function getMouseUp(event) {
    // event.preventDefault();
    switch (event.button) {
        case 0:
            inputValues.mouseLeftDown = false;
            break;
        case 1:
            inputValues.mouseMiddleDown = false;
            break;
        case 2:
            inputValues.mouseRightDown = false;
            break;
        default:
            console.error(`Unknown button code: ${event.button}`);
    }
}

function getKeyDown(event) {
    inputValues.keysDown.add(event.code);
}

function getKeyUp(event) {
    inputValues.keysDown.delete(event.code);
}

function handleScroll(event) {
    if (event.deltaY < 0 && gameController.camera.zoom < 5) {
        gameController.camera.zoom = gameController.camera.zoom * 1.5;
    }
    if (event.deltaY > 0 && gameController.camera.zoom > 0.5) {
        gameController.camera.zoom = gameController.camera.zoom / 1.5;
    }
}