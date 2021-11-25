import {
    Vector3
} from 'https://cdn.skypack.dev/three@0.134.0';

function elasticForce(springConstant, restDistance, point1, point2) {
    const delta = point2.clone().sub(point1);
    const direction = delta.clone().normalize();
    const distance = delta.length();
    const forceMagnitude = -springConstant * (distance- restDistance)

    return direction.clone().multiplyScalar(forceMagnitude);
}

export {elasticForce}