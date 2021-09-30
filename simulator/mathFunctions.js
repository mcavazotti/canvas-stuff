function convertDegreeToRadian(angle) {
    return angle * Math.PI / 180;
}

function convertRadianToDegree(angle) {
    return angle * 180 / Math.PI;
}

function gravitationalForce(obj1, obj2) {
    var dir = vectorSubtract(obj2.position, obj1.position);
    var distance = vectorLength(dir) * 1000;
    var forceMagnitude = gravitationalConstant * obj1.mass * obj2.mass / (distance * distance);
    return vectorMultiply(dir, forceMagnitude / distance);
}

function randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}