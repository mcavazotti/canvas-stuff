simParameters = {
    strandsCount: 50,
    strandSegments: 5,
    gravity: 100,
    springConstant: 150,
    particleMass: 1.0,
    segmentLength: 5,
    damping: 1,
}

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
    headPos: [0,0],
    hairStrands: []
}