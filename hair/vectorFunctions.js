function vectorSubtract(vec1, vec2) {
    return [vec1[0] - vec2[0], vec1[1] - vec2[1]];
}

function vectorAdd(vec1, vec2) {
    return [vec1[0] + vec2[0], vec1[1] + vec2[1]];
}

function vectorMultiply(vec, scalar) {
    return [vec[0] * scalar, vec[1] * scalar];
}

function vectorRotate(vec, angleDegree) {
    var radiansRotation = convertDegreeToRadian(angleDegree);
    return [vec[0] * Math.cos(radiansRotation) - vec[1] * Math.sin(radiansRotation),
    vec[0] * Math.sin(radiansRotation) + vec[1] * Math.cos(radiansRotation)]
}


function vectorLength(vec) {
    return Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1]);
}

function vectorNormalize(vec) {
    var len = vectorLength(vec);
    return [vec[0] / len, vec[1] / len];
}

function vectorDotProduct(vec1, vec2) {
    return vec1[0] * vec2[0] + vec1[1] * vec2[1];
}

function randomVectorInUnitCircle() {
    var theta = 2.0 * Math.PI * Math.random();
    var r;
    do {
        r = Math.random();
    } while (r < 0.01);


    return vectorMultiply([Math.cos(theta), Math.sin(theta)], r);

}