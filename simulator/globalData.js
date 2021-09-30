simController = {
    simRunning: false,
    targetFps: 120,
    realFps: 0,
    minimumFps: 36,
    objects: new Set(),
    camera: {
        position: [0, 0],
        renderTrail:true,
        renderHelp:false,
        frustrumWidth: 1000,
        aspectRatio: 0,
        zoom: 1,
        maxZoom: 5,
        minZoom: 0.1
    },
    simData: {
        maxDistance: 1e9,
        maxSpeedup: 64,
        speedup: 4,
        minSpeedup: 0.25,
        step: 5000,
    },
    maxTrailLength: 300,
};
cachedValues = {
    mousePos: [0, 0]
};

markerData = {
    radius: 10,
    density: 1,
    position: [0, 0],
    velocity: [0, 0],
    trail: [],
    readyToCreate: false,
};

inputValues = {
    mouseLeftDown: false,
    mouseMiddleDown: false,
    mouseRightDown: false,
    mousePos: [0, 0],
    keysDown: new Set(),
};

const gravitationalConstant = 6.674 * 1e-11;