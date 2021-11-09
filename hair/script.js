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
        var root = vectorMultiply(vec, simObjects.headSize);
        simObjects.hairRoots.push(root);
        vec = vectorAdd(root, simObjects.headPos);
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

        // deal with fps drop
        if (deltaTime > (1 / 24))
            deltaTime = 1 / 24;

        // update sim parameters
        if (newSimParameters.changed) {
            for (const key in newSimParameters) {
                if (key != 'changed') {
                    if (Object.hasOwnProperty.call(newSimParameters, key)) {
                        simParameters[key] = newSimParameters[key];
                    }
                }
            }
        }
        newSimParameters = {};
        newSimParameters.changed = false;

        // UPDATING
        if(inputValues.dragging){
            simObjects.headPos = vectorAdd(inputValues.mouseWorldPos, inputValues.dragOffset);
            for (let i = 0; i < simObjects.hairStrands.length; i++) {
                simObjects.hairStrands[i][0].pos = vectorAdd(simObjects.hairRoots[i], simObjects.headPos);
            }
        }

        updateHair(deltaTime);

        // RENDERING
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
    var key;
    switch (selector) {
        case 'gravity':
        case 'damping':
            key = selector;
            break;
        case 'spring':
            key = 'springConstant';
            break;
        case 'mass':
            key = 'particleMass'
            break;
        default:
            break;
    }

    if (key) {
        newSimParameters[key] = parseFloat(val);
        newSimParameters.changed = true;
    }
}

function getMousePosition(event) {
    var rect = camera.canvas.getBoundingClientRect();
    inputValues.mousePos = [event.clientX - rect.left, event.clientY - rect.top];
    inputValues.mouseWorldPos = convertRasterCoordToWorld(inputValues.mousePos,camera,camera.canvasSize);
}

function getMouseDown(event) {
    console.log(event.button);
    if (event.button == 0) {
        inputValues.mouseDown = true;
        var offset = vectorSubtract(simObjects.headPos,inputValues.mouseWorldPos);
        if(vectorLength(offset) <= simObjects.headSize) {
            inputValues.dragging = true;
            inputValues.dragOffset = offset;
        }
    }
}

function getMouseUp(event) {
    inputValues.mouseDown = false;
    inputValues.dragging = false;
}