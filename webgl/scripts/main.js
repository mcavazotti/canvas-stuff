function main() {
    const canvas = document.querySelector("#glCanvas");
    const gl = canvas.getContext("webgl");

    if (gl === null) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }

    const shaderProgram = initShaderProgram(gl, readTextFile("../shaders/vertex.vert"), readTextFile("../shaders/fragment.frag"))

    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
            vertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
            vertexColor: gl.getAttribLocation(shaderProgram, "aVertexColor"),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
            normalMatrix: gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
        }
    };

    const buffers = initBuffers(gl);

    var then = 0;
    function render(now) {
        now *= 0.001;  // convert to seconds
        const deltaTime = now - then;
        then = now;
    
        drawScene(gl, programInfo, buffers, deltaTime);
    
        requestAnimationFrame(render);
    }
    
    requestAnimationFrame(render);
}

