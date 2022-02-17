function convertWorldCoordToRaster(position, camera, canvasSize) {
    var camRelativeOffset = [camera.position[0] - position[0], camera.position[1] - position[1]];
    var cameraSpacePos = [camRelativeOffset[0] / (camera.frustrumWidth / camera.zoom), camRelativeOffset[1] / (camera.frustrumHeight / camera.zoom)];
    return [canvasSize[0] / 2 - (cameraSpacePos[0] * canvasSize[0] / 2), canvasSize[1] / 2 + (cameraSpacePos[1] * canvasSize[1] / 2)];
}



function convertRasterCoordToWorld(position, camera, canvasSize) {
    var cameraSpacePos = [(position[0] - canvasSize[0] / 2) / (canvasSize[0] / 2), (position[1] - canvasSize[1] / 2) / (canvasSize[1] / 2)];
    var camRelativeOffset = [cameraSpacePos[0] * (camera.frustrumWidth / camera.zoom), cameraSpacePos[1] * (camera.frustrumHeight / camera.zoom)];
    return [camera.position[0] + camRelativeOffset[0], camera.position[1] - camRelativeOffset[1]]
}
function renderHelp(context, camera, simData) {
    var controls = [
        "<comma>/<period>           speed up/down simulation",
        "<left click> + drag        create object",
        "<T>                        toggle " + (camera.renderTrail ? "off" : "on") + " trail",
        "<P>                        pause simulation",
        "<Q>                        reset camera position",
        "<R>                        reset simulation",
        "<W>/<A>/<S>/<D>            move camera",
        "<Z> + scroll               change radius of new object",
        "<X> + scroll               change density of new object",
        "<C>                        reset radius and density",
        "<B>                        toggle bounce " + (simData.bounce ? "off": "on"),
        "<H>                        hide Controls",
    ];

    context.fillStyle = '#ffffffcc';
    if (camera.renderHelp) {
        context.font = 'bold 16px Courier New';
        context.fillText("Controls:", 10, 20);
        context.font = 'lighter 11px Courier New';
        for (let i = 0; i < controls.length; i++) {
            context.fillText(controls[i], 10, 35 + i * 15)
        }
    } else {
        context.font = 'lighter 11px Courier New';
        context.fillText("Press <H> to show Controls", 10, 20);
    }
}

function renderCircleGenerator(color, radius = 1) {
    return (position, camera, canvasSize, context) => {
        var realRadius = vectorLength(vectorSubtract(convertWorldCoordToRaster([radius, 0], camera, canvasSize), convertWorldCoordToRaster([0, 0], camera, canvasSize)));

        var transformedCenter = convertWorldCoordToRaster(position, camera, canvasSize);

        context.fillStyle = color;
        context.beginPath();
        context.arc(transformedCenter[0], transformedCenter[1], realRadius, 0, convertDegreeToRadian(360));
        context.fill();
    };
}

function renderCircle(position, radius, color, camera, canvasSize, context) {
    var realRadius = vectorLength(vectorSubtract(convertWorldCoordToRaster([radius, 0], camera, canvasSize), convertWorldCoordToRaster([0, 0], camera, canvasSize)));

    var transformedCenter = convertWorldCoordToRaster(position, camera, canvasSize);

    context.fillStyle = color;
    context.beginPath();
    context.arc(transformedCenter[0], transformedCenter[1], realRadius, 0, convertDegreeToRadian(360));
    context.fill();
}

function renderTrailGenerator(color) {
    return (trail, camera, canvasSize, context) => {
        var transformedTrail = trail.map(t => convertWorldCoordToRaster(t, camera, canvasSize));
        context.strokeStyle = color;
        context.beginPath();
        context.moveTo(transformedTrail[0], transformedTrail[1]);
        for (const point of transformedTrail) {
            context.lineTo(point[0], point[1]);
        }
        context.stroke();
    }
}

function renderTrail(trail, color, camera, canvasSize, context) {
    var transformedTrail = trail.map(t => convertWorldCoordToRaster(t, camera, canvasSize));
    context.strokeStyle = color;
    context.beginPath();
    context.moveTo(transformedTrail[0], transformedTrail[1]);
    for (const point of transformedTrail) {
        context.lineTo(point[0], point[1]);
    }
    context.stroke();

}

function hexToRgb(hex) {
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : null;
}

function rgbToHex(color) {
    return "#" + ((1 << 24) + (color[0] << 16) + (color[1] << 8) + color[2]).toString(16).slice(1);
}

