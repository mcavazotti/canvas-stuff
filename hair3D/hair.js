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
    constructor(vertices, normals, numSegments, segmentLength, colorHex,) {
        super();

        for (let i = 0; i < vertices.length; i++) {
            const vertex = vertices[i];
            const normalizedNormal = normals[i].clone().normalize();

            const strand = new Map();
            strand.set(-1, new Particle(vertex.clone().sub(normalizedNormal.clone().multiplyScalar(segmentLength))));
            for (let j = 0; j < numSegments; j++) {
                strand.set(j, new Particle(vertex.clone().add(normalizedNormal.clone().multiplyScalar(segmentLength * j))));
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
            for (let j = 0; j < numSegments; j++) {
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


}