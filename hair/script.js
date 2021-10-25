function initSim() {
    // initialize camera
    camera.canvas = document.getElementById("sim");
    camera.context = camera.canvas.getContext("2d");
    camera.canvasSize = [camera.canvas.width, camera.canvas.height];
    camera.aspectRatio = camera.canvasSize[1] / camera.canvasSize[0];
    camera.frustrumHeight = camera.frustrumWidth * camera.aspectRatio;

    // initialize hair
    simObjects.hairStrands = [
        createHairStrand([0, 5], 5, [1, 1])
    ]
    renderHair(simObjects.hairStrands,"#aa7700",camera);

}

function startSim() {
    var then = 0;
    function simStep(now) {
        now *= 0.001;  // convert to seconds
        const deltaTime = now - then;
        then = now;

        updateHair(deltaTime);

        camera.context.clearRect(0, 0, camera.canvasSize[0], camera.canvasSize[1]);
        renderHair(simObjects.hairStrands,"#aa7700",camera);

        requestAnimationFrame(simStep);
    }
    requestAnimationFrame(simStep);

}
