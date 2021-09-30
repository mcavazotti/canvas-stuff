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

function renderNGon(sides, color, size = 1) {
    var points = [];
    for (let i = 0; i < sides; i++)
        points.push([size * Math.cos((2 * Math.PI * i) / sides), size * Math.sin((2 * Math.PI * i) / sides)]);


    return (transform, camera, canvasSize, context) => {
        var transformedPoints = [];
        for (const point of points) {
            // rotate
            var p = vectorRotate(point, transform.rotation);
            // scale
            p[0] = p[0] * transform.scale;
            p[1] = p[1] * transform.scale;

            // translate
            p = vectorAdd(p, transform.position);

            transformedPoints.push(convertWorldCoordToRaster(p, camera, canvasSize));
        }

        context.fillStyle = color;
        context.beginPath();
        context.moveTo(transformedPoints[0][0], transformedPoints[0][1]);
        for (let i = 1; i < transformedPoints.length; i++)
            context.lineTo(transformedPoints[i][0], transformedPoints[i][1]);

        // context.closePath();
        context.fill();
    };
}

function renderCircle(color, radius = 1) {
    return (transform, camera, canvasSize, context) => {
        var scaledRadiusVector = vectorMultiply([radius, 0], transform.scale)
        var realRadius = vectorLength(vectorSubtract(convertWorldCoordToRaster(scaledRadiusVector, camera, canvasSize), convertWorldCoordToRaster([0, 0], camera, canvasSize)));

        var transformedCenter = convertWorldCoordToRaster(transform.position, camera, canvasSize);

        context.fillStyle = color;
        context.beginPath();
        context.arc(transformedCenter[0], transformedCenter[1], realRadius, 0, convertDegreeToRadian(360));
        context.fill();
    };

}

function renderFixedGrid(topLeft, bottomRight, spacing, lineColor, bgColor, lineWidth = 1, lineOffset = [0, 0]) {
    var horizontalLines = [];
    var verticalLines = [];

    var y = bottomRight[1] + lineOffset[1];
    while (y < topLeft[1]) {
        horizontalLines.push([[topLeft[0], y], [bottomRight[0], y]]);
        y += spacing;
    }

    var x = topLeft[0] + lineOffset[0];
    while (x < bottomRight[0]) {
        verticalLines.push([[x, topLeft[1]], [x, bottomRight[1]]]);
        x += spacing;
    }

    return (transform, camera, canvasSize, context) => {

        context.lineWidth = lineWidth;
        context.strokeStyle = lineColor;
        context.fillStyle = bgColor;

        var rasterTopLeft = convertWorldCoordToRaster(topLeft, camera, canvasSize);
        var rasterBottomRight = convertWorldCoordToRaster(bottomRight, camera, canvasSize);

        context.fillRect(rasterTopLeft[0], rasterTopLeft[1], rasterBottomRight[0] - rasterTopLeft[0], rasterBottomRight[1] - rasterTopLeft[1]);

        var transformedLines = [];
        for (const line of horizontalLines) {
            var p1 = convertWorldCoordToRaster(line[0], camera, canvasSize);
            if (p1[1] >= 0 && p1[1] <= canvasSize[1]) {
                var p2 = convertWorldCoordToRaster(line[1], camera, canvasSize);

                transformedLines.push([p1, p2]);
            }
        }
        for (const line of verticalLines) {
            var p1 = convertWorldCoordToRaster(line[0], camera, canvasSize);
            if (p1[0] >= 0 && p1[0] <= canvasSize[0]) {
                var p2 = convertWorldCoordToRaster(line[1], camera, canvasSize);

                transformedLines.push([p1, p2]);
            }
        }

        context.beginPath();
        for (const line of transformedLines) {
            context.moveTo(line[0][0], line[0][1]);
            context.lineTo(line[1][0], line[1][1]);
        }
        context.stroke();
    }
}

function renderPlayer() {
    var circleFunc = renderCircle('#0081a7');
    var triangleFunc = renderNGon(3, '#00afb9', 0.8);
    return (transform, camera, canvasSize, context) => {
        circleFunc(transform, camera, canvasSize, context);
        triangleFunc(transform, camera, canvasSize, context);
    };
}