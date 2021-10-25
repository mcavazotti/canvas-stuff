function createHairStrand(rootPosition, numberOfSegments, direction = [0, -1]) {
    var unitDirection = vectorNormalize(direction);
    var strand = [{ pos: rootPosition, vel: [0, 0] }];
    var lastPoint = rootPosition;
    for (let i = 0; i < numberOfSegments; i++) {
        var point = vectorAdd(lastPoint, vectorMultiply(unitDirection, simParameters.segmentLength));
        strand.push({ pos: point, vel: [0, 0] });
        lastPoint = point;
    }

    return strand;
}


function updateHair(step) {
    for (let strand of simObjects.hairStrands) {
        updateStrand(strand,step);
    }
}

function updateStrand(strand,step) {
    var forces = [];
    for (let i = 1; i < strand.length; i++) {
        var elastic = elasticForce(simParameters.springConstant, simParameters.segmentLength, strand[i - 1].pos, strand[i].pos);
        var damping = vectorMultiply(strand[i].vel,simParameters.damping);
        forces.push({ elastic: elastic, damping: damping });
    }

    var gravityForce = vectorMultiply([0, -1], simParameters.particleMass * simParameters.gravity);

    for (let i = 1; i < strand.length; i++) {
        var netForce = vectorSubtract(vectorAdd(forces[i - 1].elastic, gravityForce),forces[i-1].damping);
        if(i < strand.length-1) {
            netForce = vectorAdd(vectorSubtract(netForce,forces[i].elastic),forces[i].damping);
        } 
        
        var acceleration = vectorMultiply(netForce,1/simParameters.particleMass);

        strand[i].vel = vectorAdd(strand[i].vel, vectorMultiply(acceleration,step));
        strand[i].pos = vectorAdd(strand[i].pos, vectorMultiply(strand[i].vel,step));
    }
}
