function createGameObject(posX, posY, rotation, renderFunction, updateFunction, objectData = {}) {
    return {
        transform: {
            position: [posX, posY],
            rotation: rotation,
            scale: 1
        },
        markedForRemoval: false,
        render: renderFunction,
        update: updateFunction,
        data: objectData,
    };
}

function createPlayerData() {
    return {
        speed: 5,
        bulletSpeed: 20,
        range: 30,
        lastShoot: 0,
        shootsPerSecond: 1.5
    };
}