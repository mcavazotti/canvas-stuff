import { NodeEnviroment } from "./node-env";

export function main() {
    const background = document.getElementById("canvas-bg") as HTMLCanvasElement;
    const bgContext = background.getContext("2d")!;

    const board = document.getElementById("canvas-board") as HTMLCanvasElement;
    const boardContext = board.getContext("2d")!;

    const input = document.getElementById("canvas-input") as HTMLCanvasElement;
    const inutContext = input.getContext("2d")!;

    const nodes = new NodeEnviroment(
        { element: background, context: bgContext },
        { element: board, context: boardContext },
        { element: input, context: inutContext });

    nodes.start();

}