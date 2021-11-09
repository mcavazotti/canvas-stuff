simParameters = {
    gravity: 100,
    springConstant: 150,
    particleMass: 1.0,
    strandsCount: 50,
    strandSegments: 10,
    segmentLength: 2,
    damping: 1,
}

inputValues = {
    mousePos: [0, 0],
    mouseWorldPos: [0, 0],
    mouseDown: false,
    dragging: false,
    dragOffset: [0,0],
}

newSimParameters = {
    changed: false
};

camera = {
    canvas: null,
    context: null,
    canvasSize: [0, 0],
    position: [0, 0],
    frustrumWidth: 100,
    aspectRatio: 0,
    zoom: 1,
    maxZoom: 5,
    minZoom: 0.1
}
simObjects = {
    headSize: 10,
    headPos: [0, 0],
    hairRoots: [],
    hairStrands: []
}