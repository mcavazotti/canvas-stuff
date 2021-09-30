gameController = {
    gameRunning: false,
    targetFps:24,
    realFps: 0,
    player:{},
    objects: new Set(),
    camera: {
        position: [0, 0],
        frustrumWidth: 15,
        aspectRatio: 0,
        zoom: 1
    },
};

worldData = {}

cachedValues = {
    mousePos: [0, 0]
};

inputValues = {
    mouseLeftDown: false,
    mouseMiddleDown: false,
    mouseRightDown: false,
    mousePos: [0, 0],
    keysDown: new Set(),
};