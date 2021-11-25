import {
    LineSegments,
    Vector3,
    BufferGeometry,
    Color,
    Float32BufferAttribute,
    LineBasicMaterial
} from 'https://cdn.skypack.dev/three@0.134.0';

import { Particle } from './particle.js';
import { elasticForce } from './physics.js';

export class Hair extends LineSegments {
    strands = [];

    #numSegments = 5;
    #previousDeltaTime = 0;
    segmentLength = 0.2;
    elasticCoeficient = 100;
    auxElasticCoeficient = 1;
    auxLengthRatio = 2;
    particleMass = 1;
    gravity = 10;
    damping = 10;

    previousGlobalPosition = new Vector3();
    globalPosition = new Vector3();

    constructor(vertices, normals, colorHex, params) {
        super();
        this.setParams(params);

        for (let i = 0; i < vertices.length; i++) {
            const vertex = vertices[i];
            const normalizedNormal = normals[i].clone().normalize();

            const strand = new Map();
            strand.set(-1, new Particle(vertex.clone().sub(normalizedNormal.clone().multiplyScalar(this.segmentLength))));
            for (let j = 0; j < this.#numSegments; j++) {
                strand.set(j, new Particle(vertex.clone().add(normalizedNormal.clone().multiplyScalar(this.segmentLength * j))));
            }
            this.strands.push(strand);
        }

        const color = new Color(colorHex);

        const geometry = new BufferGeometry();

        const indices = [];
        const hairVertices = [];
        const colors = [];
        var index = 0;

        for (let i = 0; i < this.strands.length; i++) {
            const strand = this.strands[i];
            for (let j = 0; j < this.#numSegments; j++) {
                const particle = strand.get(j);

                hairVertices.push(particle.position.x, particle.position.y, particle.position.z);
                colors.push(color.r, color.g, color.b);

                if (j != 0) {
                    indices.push(index - 1, index);
                }
                index++;
            }
        }

        geometry.setIndex(indices);
        geometry.setAttribute('position', new Float32BufferAttribute(hairVertices, 3));
        geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));

        this.geometry = geometry;
        this.material = new LineBasicMaterial({ vertexColors: true })
    }

    setParams(params) {
        if ('numSegments' in params)
            this.#numSegments = params.numSegments;
        if ('segmentLength' in params)
            this.segmentLength = params.segmentLength;
        if ('elasticCoeficient' in params)
            this.elasticCoeficient = params.elasticCoeficient;
        if ('auxElasticCoeficient' in params)
            this.auxElasticCoeficient = params.auxElasticCoeficient;
        if ('auxLengthRatio' in params)
            this.auxLengthRatio = params.auxLengthRatio;
        if ('mass' in params)
            this.particleMass = params.mass;
        if ('gravity' in params)
            this.gravity = params.gravity;
        if ('damping' in params)
            this.damping = params.damping;
    }

    init() {
        this.getWorldPosition(this.globalPosition);
        this.previousGlobalPosition = this.globalPosition.clone();
        for (const strand of this.strands) {
            for (let i = -1; i < this.#numSegments; i++) {
                const particle = strand.get(i);
                particle.position.add(this.globalPosition);
                particle.previousPos.add(this.globalPosition);
            }
        }
    }

    simulateStep(deltaTime) {
        for (const strand of this.strands) {
            for (let i = 1; i < this.#numSegments; i++) {
                const particle = strand.get(i);

                // gravity force
                particle.actingForces = new Vector3(0, 0, -1).multiplyScalar(this.particleMass * this.gravity);

                // direct iteraction with segments
                var elastic1 = elasticForce(this.elasticCoeficient, this.segmentLength, particle.position, strand.get(i - 1).position);
                var elastic2;
                particle.actingForces.add(elastic1);
                if (i + 1 < this.#numSegments){
                    elastic2 = elasticForce(this.elasticCoeficient, this.segmentLength, particle.position, strand.get(i + 1).position);
                    particle.actingForces.sub(elastic2);
                }

                // stiffness
                var stiff1 = elasticForce(this.auxElasticCoeficient, this.segmentLength * this.auxLengthRatio, particle.position, strand.get(i - 2).position);
                var stiff2;
                particle.actingForces.add(stiff1);
                if (i + 2 < this.#numSegments){
                    stiff2 = elasticForce(this.auxElasticCoeficient, this.segmentLength * this.auxLengthRatio, particle.position, strand.get(i + 2).position);
                    particle.actingForces.sub(stiff2);
                }

                // damping
                var damp = particle.getVelocity(this.#previousDeltaTime).multiplyScalar(this.damping);
                particle.actingForces.sub(damp);
            }

            for (let i = 1; i < this.#numSegments; i++) {
                const particle = strand.get(i);

                const acceleration = particle.actingForces.clone().multiplyScalar(1 / this.particleMass);
                const finalVelocity = particle.getVelocity(this.#previousDeltaTime).add(acceleration.multiplyScalar(deltaTime));
                const newPos = particle.position.clone().add(finalVelocity.multiplyScalar(deltaTime));
                // console.log("pos",newPos);
                particle.updatePosition(newPos);

            }
        }
        this.#previousDeltaTime = deltaTime;
        this.#updateGeometry();
    }

    #updateGeometry() {
        var index = 0;
        const position = this.geometry.attributes.position.array;

        for (let i = 0; i < this.strands.length; i++) {
            const strand = this.strands[i];
            for (let j = 0; j < this.#numSegments; j++) {
                const particle = strand.get(j);
                const particlePos = particle.position.clone().sub(this.globalPosition);

                position[index++] = particlePos.x;
                position[index++] = particlePos.y;
                position[index++] = particlePos.z;

            }
        }
        this.geometry.attributes.position.needsUpdate = true;
    }

}