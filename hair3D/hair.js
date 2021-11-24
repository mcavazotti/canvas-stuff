import {
    LineSegments,
    Vector3,
    BufferGeometry,
    Color,
    Float32BufferAttribute,
    LineBasicMaterial
} from 'https://cdn.skypack.dev/three@0.134.0';

import { Particle } from './particle.js';

export class Hair extends LineSegments {
    strands = [];

    #numSegments = 5;
    segmentLength = 0.2;
    elasticCoeficient = 100;
    particleMass = 0.01;
    gravity = 10;
    damping = 1;

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
            for (const particle of strand) {
                particle.position.add(this.globalPosition);
                particle.previousPos.add(this.globalPosition);
            }
        }
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