function initSim() {
    // initalize range input
    $("#gravity").val(simParameters.gravity);
    $("#spring").val(simParameters.springConstant);
    $("#damping").val(simParameters.damping);
    $("#mass").val(simParameters.particleMass);

    $("#gravity-span").html(simParameters.gravity);
    $("#spring-span").html(simParameters.springConstant);
    $("#damping-span").html(simParameters.damping);
    $("#mass-span").html(simParameters.particleMass);

    // initialize camera
    camera.canvas = $("#sim")[0];
    camera.context = camera.canvas.getContext("2d");
    camera.canvasSize = [camera.canvas.width, camera.canvas.height];
    camera.aspectRatio = camera.canvasSize[1] / camera.canvasSize[0];
    camera.frustrumHeight = camera.frustrumWidth * camera.aspectRatio;

    // initialize hair
    for (let i = 0; i < simParameters.strandsCount; i++) {
        var vec = randomVectorInUnitCircle();
        console.log(vectorLength(vec));
        vec = vectorAdd(vectorMultiply(vec, simObjects.headSize), simObjects.headPos);
        console.log(vectorLength(vec));
        simObjects.hairStrands.push(createHairStrand(vec, simParameters.strandSegments));

    }

    renderCircle(simObjects.headPos, simObjects.headSize, "#ffe291", camera);
    renderHair(simObjects.hairStrands, "#aa7700", camera);

}

function startSim() {
    var then = 0;
    function simStep(now) {
        now *= 0.001;  // convert to seconds
        var deltaTime = now - then;
        then = now;

        if (deltaTime > (1 / 24))
            deltaTime = 1 / 24;

        updateHair(deltaTime);

        camera.context.clearRect(0, 0, camera.canvasSize[0], camera.canvasSize[1]);

        // render head
        renderCircle(simObjects.headPos, simObjects.headSize, "#ffe291", camera);
        renderHair(simObjects.hairStrands, "#aa7700", camera);


        requestAnimationFrame(simStep);
    }
    requestAnimationFrame(simStep);

}

function changeParameters(val, selector) {
    $("#" + selector + "-span").html(val);
    simParameters[selector] = val;
    console.log(selector, simParameters[selector]);
}