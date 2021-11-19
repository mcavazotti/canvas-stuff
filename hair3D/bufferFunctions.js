import {
    Vector2,
    Vector3
} from 'https://cdn.skypack.dev/three@0.134.0';

function convertPositionBufferToVec3(buffer) {
    var array = [];
    console.log(buffer);
    for (let i = 0; i < buffer.array.length; i += 3)
        array.push(new Vector3(buffer.array[i], buffer.array[i + 1], buffer.array[i + 2]))
    return array.filter((vec, idx, self) => idx === self.findIndex((v) => (v.x === vec.x && v.y === vec.y && v.z === vec.z)));
}

function convertVec3ArrayToBuffer(array) {
    var flattenedArray = [].concat.apply([], array.map(v => [v.x, v.y, v.z]));
    return new Float32Array(flattenedArray)
}

export { convertPositionBufferToVec3, convertVec3ArrayToBuffer }