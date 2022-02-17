function getMousePosition(event) {
    var rect = simController.canvas.getBoundingClientRect();
    inputValues.mousePos = [event.clientX - rect.left, event.clientY - rect.top];

    // update marker
    if (!markerData.readyToCreate) {
        markerData.position = convertRasterCoordToWorld(inputValues.mousePos, simController.camera, simController.canvasSize);
        markerData.velocity = [0, 0];
    } else {
        var mouseWorldPos = convertRasterCoordToWorld(inputValues.mousePos, simController.camera, simController.canvasSize);
        var deltaPos = vectorSubtract(markerData.position, mouseWorldPos);
        markerData.velocity = vectorMultiply(deltaPos, 1 / simController.simData.step);
        markerData.trail = [markerData.position, vectorAdd(markerData.position, deltaPos)];
    }
}

function getMouseDown(event) {
    // event.preventDefault();
    if (simController.simRunning) {

        switch (event.button) {
            case 0:
                inputValues.mouseLeftDown = true;

                // update marker
                markerData.position = convertRasterCoordToWorld(inputValues.mousePos, simController.camera, simController.canvasSize);
                markerData.readyToCreate = true;
                break;
            case 1:
                inputValues.mouseMiddleDown = true;
                break;
            case 2:
                inputValues.mouseRightDown = true;
                break;
            default:
                console.error(`Unknown button code: ${event.button}`);
        }
    }
}

function getMouseUp(event) {
    // event.preventDefault();
    if (simController.simRunning) {

        switch (event.button) {
            case 0:
                inputValues.mouseLeftDown = false;

                // update marker
                markerData.trail = [];
                // create object
                if (markerData.readyToCreate) {
                    var color = [randomInt(50, 256), randomInt(50, 256), randomInt(50, 256)]
                    simController.objects.add(createObject(markerData.position, markerData.radius, markerData.density, markerData.velocity, rgbToHex(color)));
                    markerData.readyToCreate = false;
                }

                break;
            case 1:
                inputValues.mouseMiddleDown = false;
                break;
            case 2:
                inputValues.mouseRightDown = false;

                // update marker
                markerData.trail = [];
                markerData.readyToCreate = false;
                break;
            default:
                console.error(`Unknown button code: ${event.button}`);
        }
    }
}

function getKeyDown(event) {
    if (simController.simRunning) {

        inputValues.keysDown.add(event.code);
    }
}

function getKeyUp(event) {
    if (simController.simRunning) {

        handleKeyUp(event.code);
        inputValues.keysDown.delete(event.code);
    }
}

function handleScroll(event) {
    if (simController.simRunning) {

        console.log(simController.camera.zoom);
        if (event.deltaY < 0) {
            if (inputValues.keysDown.has("KeyZ")) {
                if (markerData.radius < markerData.maxRadius) {
                    markerData.radius *= 1.25;
                }
            } else
                if (inputValues.keysDown.has("KeyX")) {
                    if(markerData.density < markerData.maxDensity) {
                        markerData.density *= 1.25;
                    }

                    console.log(markerData.density);
                } else
                    if (simController.camera.zoom < simController.camera.maxZoom) {
                        simController.camera.zoom = simController.camera.zoom * 1.5;
                    }
        }
        if (event.deltaY > 0) {
            if (inputValues.keysDown.has("KeyZ")) {
                if (markerData.radius > markerData.minRadius) {
                    markerData.radius *= 0.8;
                }
            } else
                if (inputValues.keysDown.has("KeyX")) {
                    if (markerData.density > markerData.minDensity) {
                    markerData.density *= 0.8;
                    }
                    console.log(markerData.density);
                } else
                    if (simController.camera.zoom > simController.camera.minZoom) {
                        simController.camera.zoom = simController.camera.zoom / 1.5;
                    }
        }
    }
}

function handleKeyUp(code) {
    switch (code) {
        case 'KeyQ':
            simController.camera.position = [0, 0];
            break;
        case 'KeyR':
            resetSim()
            break;
        case 'KeyT':
            simController.camera.renderTrail = !simController.camera.renderTrail;
            break;
        case 'KeyP':
            simController.simData.paused = !simController.simData.paused;
            break;
        case 'KeyH':
            simController.camera.renderHelp = !simController.camera.renderHelp;
            break;
        case 'KeyC':
            markerData.radius = 10;
            markerData.density = 500;
            break;
        case 'KeyB':
            simController.simData.bounce = !simController.simData.bounce;
            break;
        case 'Comma':
            var newSimSpeed = 2 * simController.simData.speedup;
            simController.simData.speedup = simController.simData.maxSpeedup < newSimSpeed ? simController.simData.maxSpeedup : newSimSpeed;
            console.log(simController.simData.speedup);
            break;
        case 'Period':
            var newSimSpeed = 0.5 * simController.simData.speedup;
            simController.simData.speedup = simController.simData.minSpeedup > newSimSpeed ? simController.simData.minSpeedup : newSimSpeed;
            console.log(simController.simData.speedup);
            break;
        default:
            break;
    }
}