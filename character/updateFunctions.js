function updatePlayer() {
    //rotate player
    if (cachedValues.mousePos[0] != inputValues.mousePos[0] || cachedValues.mousePos[1] != inputValues.mousePos[1]) {
        cachedValues.mousePos = [...inputValues.mousePos];

        var lookingAt = vectorAdd(vectorRotate([1, 0], this.transform.rotation), this.transform.position);
        var mouseWorldPos = convertRasterCoordToWorld(cachedValues.mousePos, gameController.camera, gameController.canvasSize);
        if (vectorLength(vectorSubtract(mouseWorldPos, this.transform.position)) > 0.001) {
            var vecCurrent = vectorNormalize(vectorSubtract(lookingAt, this.transform.position));
            var vecTarget = vectorNormalize(vectorSubtract(mouseWorldPos, this.transform.position));
            var deltaAngle = convertRadianToDegree(Math.atan2(vecCurrent[0] * vecTarget[1] - vecCurrent[1] * vecTarget[0], vecCurrent[0] * vecTarget[0] + vecCurrent[1] * vecTarget[1]));
            this.transform.rotation = (this.transform.rotation + deltaAngle) % 360;
        }
    }
    var movement = [0, 0];

    // move player
    if (inputValues.keysDown.has('KeyW')) {
        movement = vectorAdd(movement, [0, 1]);
    }
    if (inputValues.keysDown.has('KeyD')) {
        movement = vectorAdd(movement, [1, 0]);
    }
    if (inputValues.keysDown.has('KeyS')) {
        movement = vectorAdd(movement, [0, -1]);
    }
    if (inputValues.keysDown.has('KeyA')) {
        movement = vectorAdd(movement, [-1, 0]);
    }

    if (movement[0] != 0 || movement[1] != 0) {
        movement = vectorMultiply(vectorNormalize(movement), this.data.speed / gameController.realFps);

        var newPos = vectorAdd(this.transform.position, movement);
        if (newPos[0] > worldData.bottomRight[0]) {
            newPos[0] = worldData.bottomRight[0];
        }
        if (newPos[0] < worldData.topLeft[0]) {
            newPos[0] = worldData.topLeft[0];
        }
        if (newPos[1] > worldData.topLeft[1]) {
            newPos[1] = worldData.topLeft[1];
        }
        if (newPos[1] < worldData.bottomRight[1]) {
            newPos[1] = worldData.bottomRight[1];
        }

        this.transform.position = newPos;
        gameController.camera.position = newPos;
    }

    if (inputValues.mouseLeftDown) {
        var now = performance.now();
        if ((now - this.data.lastShoot) >= 1000 / this.data.shootsPerSecond) {
            this.data.lastShoot = now;
            gameController.objects.add(createGameObject(
                this.transform.position[0],
                this.transform.position[1],
                this.transform.rotation,
                renderCircle('#f07167', 0.2),
                updateBullet,
                { direction: vectorRotate([1, 0], this.transform.rotation), range: this.data.range, speed: this.data.bulletSpeed, distanceTraveled: 0 }
            )
            );
        }
    }
}

function updateBullet() {
    var newPos = vectorAdd(this.transform.position, vectorMultiply(this.data.direction, this.data.speed / gameController.realFps));
    this.data.distanceTraveled += this.data.speed / gameController.realFps;

    if (newPos[0] > worldData.bottomRight[0] || newPos[0] < worldData.topLeft[0] || newPos[1] > worldData.topLeft[1] || newPos[1] < worldData.bottomRight[1] || this.data.distanceTraveled > this.data.range) {
        this.markedForRemoval = true;
    }

    this.transform.position = newPos;
}