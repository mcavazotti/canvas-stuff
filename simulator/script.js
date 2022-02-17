
function initSim() {
    // set up variables
    simController.canvas = document.getElementById("sim");
    simController.context = simController.canvas.getContext("2d");
    simController.canvasSize = [simController.canvas.width, simController.canvas.height];
    simController.camera.aspectRatio = simController.canvasSize[1] / simController.canvasSize[0];
    simController.camera.frustrumHeight = simController.camera.frustrumWidth * simController.camera.aspectRatio;

    resetSim();

    // set up functions
    simController.clear = () => {
        simController.context.clearRect(0, 0, simController.canvasSize[0], simController.canvasSize[1]);
    };
    simController.render = () => {
        simController.context.fillStyle = '#040252';
        simController.context.fillRect(0, 0, simController.canvasSize[0], simController.canvasSize[1]);

        for (const obj of simController.objects) {
            if (simController.camera.renderTrail) {
                obj.renderTrail(obj.trail, simController.camera, simController.canvasSize, simController.context);
            }
            obj.render(obj.position, simController.camera, simController.canvasSize, simController.context);
        }

        //render UI
        renderTrail(markerData.trail, '#ff3838aa', simController.camera, simController.canvasSize, simController.context);
        renderCircle(markerData.position, markerData.radius, '#ff3838aa', simController.camera, simController.canvasSize, simController.context);

        renderHelp(simController.context, simController.camera, simController.simData);
        if (simController.simData.paused) {
            simController.context.fillStyle = '#ffffffcc';
            simController.context.font = '20px Courier New';
            simController.context.fillText("Paused", simController.canvasSize[0] - 100, 30)
        }

        simController.context.fillStyle = '#ffffffcc';
        simController.context.font = 'bold 14px Courier New';
        simController.context.fillText("New object info", 20, simController.canvasSize[1] - 35);
        simController.context.font = '12px Courier New';
        simController.context.fillText("Radius: " + markerData.radius.toPrecision(4) + " km", 20, simController.canvasSize[1] - 20);
        simController.context.fillText("Density: " + markerData.density.toPrecision(4) + " kg/m^3", 20, simController.canvasSize[1] - 10);

    };

    simController.updateObjects = (placeholderFps) => {
        // update camera
        var cameraMovement = [0, 0]
        if (inputValues.keysDown.has('KeyW'))
            cameraMovement = vectorAdd(cameraMovement, [0, 1]);
        if (inputValues.keysDown.has('KeyA'))
            cameraMovement = vectorAdd(cameraMovement, [-1, 0]);
        if (inputValues.keysDown.has('KeyS'))
            cameraMovement = vectorAdd(cameraMovement, [0, -1]);
        if (inputValues.keysDown.has('KeyD'))
            cameraMovement = vectorAdd(cameraMovement, [1, 0]);

        if (vectorLength(cameraMovement) > 0.001) {
            cameraMovement = vectorNormalize(cameraMovement);
        }

        simController.camera.position = vectorAdd(simController.camera.position, vectorMultiply(cameraMovement, simController.camera.frustrumWidth / (2 * simController.camera.zoom * simController.realFps)));


        // simulate objects 
        if (!simController.simData.paused) {

            for (let i = 0; i <= simController.simData.speedup; i++) {
                var fps = (placeholderFps ? placeholderFps : simController.realFps) * simController.simData.speedup;
                // update objects 
                var deleteObjects = [];
                for (const obj of simController.objects) {
                    var resultingForce = [0, 0]
                    //remove obj if too far away
                    if (vectorLength(obj.position) > simController.simData.maxDistance || obj.markedForDeletion) {
                        deleteObjects.push(obj);
                    } else {
                        for (const obj2 of simController.objects) {
                            // check if it's a valid obj
                            if (obj != obj2 && !obj2.markedForDeletion) {
                                // check for colision
                                var positionOffset = vectorSubtract(obj2.position, obj.position);
                                if (vectorLength(positionOffset) > obj.radius + obj2.radius) {
                                    resultingForce = vectorAdd(resultingForce, gravitationalForce(obj, obj2));
                                } else {
                                    if (simController.simData.bounce) {
                                        var relativeVelocity = vectorSubtract(obj2.velocity,obj.velocity);
                                        var dampedVelocity = vectorMultiply(relativeVelocity,(1 + elasticCoefficient));
                                        var contactNormal = vectorNormalize(positionOffset);
                                        var impulse = (vectorDotProduct(dampedVelocity,contactNormal))/(vectorDotProduct(contactNormal,contactNormal) * (1/obj.mass + 1/obj2.mass));

                                        obj.velocity = vectorAdd(obj.velocity,vectorMultiply(contactNormal,impulse/obj.mass));
                                        obj2.velocity = vectorSubtract(obj2.velocity,vectorMultiply(contactNormal,impulse/obj2.mass));
                                    } else {
                                        if (obj.mass < obj2.mass) {
                                            obj.markedForDeletion = true;
                                            // obj2.mass += obj.mass;
                                            deleteObjects.push(obj);
                                        } else {
                                            obj2.markedForDeletion = true;
                                            // obj.mass += obj2.mass;
                                            deleteObjects.push(obj2);
                                        }
                                    }
                                }
                            }
                        }
                        var acceleration = vectorMultiply(resultingForce, 1 / obj.mass);

                        if (obj.trail.length > simController.maxTrailLength) {
                            obj.trail.shift();
                        }

                        obj.trail.push(obj.position);

                        obj.velocity = vectorAdd(obj.velocity, vectorMultiply(acceleration, simController.simData.step / fps));
                        obj.position = vectorAdd(obj.position, vectorMultiply(obj.velocity, simController.simData.step / fps));
                    }
                }
                for (const obj of deleteObjects) {
                    simController.objects.delete(obj);
                }
            }
        }
    };


    // render inital screen
    simController.render();
    simController.context.fillStyle = '#ffffffaa';
    simController.context.font = '48px Arial';
    var textSize = simController.context.measureText("Click to start");
    simController.context.fillText("Click to start", (simController.canvasSize[0] - textSize.width) / 2, simController.canvasSize[1] / 2);
}

function resetSim() {
    simController.camera.position = [0,0];
    simController.camera.zoom = 1;

    simController.simData.speedup = 4;

    simController.objects.clear();
    simController.objects.add(createObject([0, 0], 100, 1400, [0, 0], '#ffdd00', 'sun'))
    simController.objects.add(createObject([450, 0], 12, 1600, [0, 0.03], '#2aabde', 'earth'))
    simController.objects.add(createObject([425, 1], 2, 15, [0, 0.036], '#ffddee',))
}

function startSim() {
    if (!simController.simRunning) {
        console.log("running");
        simController.simRunning = true;
        var lastTimestamp = performance.now();
        setInterval(() => {
            var curTimestamp = performance.now();
            simController.realFps = 1000 / (curTimestamp - lastTimestamp);
            lastTimestamp = curTimestamp;

            if (simController.realFps < simController.minimumFps) {
                var iterations = Math.round(simController.minimumFps / simController.realFps)
                console.log(simController.realFps, iterations);
                for (let i = 0; i < iterations; i++) {
                    simController.updateObjects(simController.minimumFps);
                }
            }
            else {
                simController.updateObjects();
            }
            simController.clear();
            simController.render();
        }, 1000 / simController.targetFps);
    }
}