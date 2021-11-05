function convertDegreeToRadian(angle) {
    return angle * Math.PI / 180;
}

function convertRadianToDegree(angle) {
    return angle * 180 / Math.PI;
}

function elasticForce(springConstant, restDistance,point1, point2){
    var delta = vectorSubtract(point2, point1);
    var direction = vectorNormalize(delta);
    var distance = Math.abs(vectorLength(delta));
    var forceMagnitude = -springConstant * (distance - restDistance);
    
    return vectorMultiply(direction,forceMagnitude);
}

function randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(randomFloat(min,max)); //The maximum is exclusive and the minimum is inclusive
}

function randomFloat(min,max) {
    return Math.random() * (max - min) + min; //The maximum is exclusive and the minimum is inclusive
}