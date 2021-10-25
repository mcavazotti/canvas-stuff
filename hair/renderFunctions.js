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

function renderHair(hair,color,camera) {
    for(let strand of hair){
        renderHairStrand(strand,color,camera);
    }
}

function renderHairStrand(hairStrand, color, camera) {
    var mappedCoords = hairStrand.map((p) => convertWorldCoordToRaster(p.pos,camera,camera.canvasSize));
    camera.context.strokeStyle = color;
    camera.context.beginPath();
    camera.context.moveTo(mappedCoords[0], mappedCoords[1]);
    for (const point of mappedCoords) {
        camera.context.lineTo(point[0], point[1]);
    }
    camera.context.stroke();
}

function renderCircle(position, radius, color, camera) {
    var realRadius = vectorLength(vectorSubtract(convertWorldCoordToRaster([radius, 0], camera, camera.canvasSize), convertWorldCoordToRaster([0, 0], camera, camera.canvasSize)));

    var transformedCenter = convertWorldCoordToRaster(position, camera, camera.canvasSize);

    camera.context.fillStyle = color;
    camera.context.beginPath();
    camera.context.arc(transformedCenter[0], transformedCenter[1], realRadius, 0, convertDegreeToRadian(360));
    camera.context.fill();
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

