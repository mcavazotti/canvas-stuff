import { Vector2 } from "../core/math/vector.js";
import { BaseNode } from "./node-defs/base-node.js";
import { OutputNode } from "./node-defs/output-node.js";

export class NodeEngine{
    
    static instance: NodeEngine;
    private _nodes: BaseNode[];
    get nodes(): BaseNode[] {
        return this._nodes;
    } 

    private constructor() {
        this._nodes = [new OutputNode(new Vector2())]
    }

    static getInstance(): NodeEngine {
        if(!NodeEngine.instance) {
            NodeEngine.instance = new NodeEngine();
        }
        return NodeEngine.instance;
    }

}