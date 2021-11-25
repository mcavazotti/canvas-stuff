import { Vector3 } from 'https://cdn.skypack.dev/three@0.134.0';

export class Particle {
    position;
    previousPos;
    actingForces;

    constructor(pos) {
        this.position = pos.clone();
        this.previousPos = pos.clone();
        this.actingForces = new Vector3();
    }

    getVelocity(deltaTime) {
        if (deltaTime == 0)
            return new Vector3(0, 0, 0);

        const direction = this.position.clone().sub(this.previousPos).normalize();
        const velocity = this.previousPos.distanceTo(this.position) / deltaTime;

        return direction.clone().multiplyScalar(velocity);
    }

    updatePosition(newPos) {
        this.previousPos = this.position.clone();
        this.position = newPos.clone();
    }
}