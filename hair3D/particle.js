import { Vector3 } from 'https://cdn.skypack.dev/three@0.134.0';

export class Particle {
    position;
    previousPos;
    actingForces;

    constructor (pos) {
        this.position = pos.clone();
        this.previousPos = pos.clone();
        this.actingForces = new Vector3();
    }

    getVelocity(deltaTime) {
        return this.previousPos.distanceTo(this.position) / deltaTime;
    }
}