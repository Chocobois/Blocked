import { BaseScene } from "@/scenes/BaseScene";
import { User } from "@/users/User";
import emojis from "@/generator/emojis/all.json";
import { ProfileImage } from "./ProfileImage";
import { Color } from "@/util/colors";

export class Slitherlink extends Phaser.GameObjects.Container {
	public scene: BaseScene;
	public user: User;

	private cells: Cell[];
	private corners: Corner[];
	private edges: Edge[];

	constructor(scene: BaseScene, x: number, y: number, level: number[][]) {
		super(scene, x, y);
		scene.add.existing(this);
		this.scene = scene;

		const gridWidth = level[0].length;
		const gridHeight = level.length;

		const boardHeight = 1080 - 200;
		const size = boardHeight / gridHeight;
		const boardWidth = gridWidth * size;
		const left = -boardWidth / 2;
		const top = -boardHeight / 2;

		function toCoord(i: number, j: number) {
			return { x: left + size * i, y: top + size * j };
		}

		/* Generate objects */

		this.cells = [];
		this.corners = [];
		this.edges = [];

		for (let i = 0; i < gridWidth; i++) {
			for (let j = 0; j < gridHeight; j++) {
				const { x, y } = toCoord(i + 0.5, j + 0.5);
				const value = level[j][i];
				const cell = new Cell(scene, i + 0.5, j + 0.5, x, y, size, value);
				this.cells.push(cell);
				this.add(cell);
			}
		}

		for (let i = 0.5; i < gridWidth; i++) {
			for (let j = 0; j <= gridHeight; j++) {
				const { x, y } = toCoord(i, j);
				const edge = new Edge(scene, i, j, x, y, size, false);
				this.edges.push(edge);
				this.add(edge);
				edge.on("update", this.updateEdge, this);
			}
		}

		for (let i = 0; i <= gridWidth; i++) {
			for (let j = 0.5; j < gridHeight; j++) {
				const { x, y } = toCoord(i, j);
				const edge = new Edge(scene, i, j, x, y, size, true);
				this.edges.push(edge);
				this.add(edge);
				edge.on("update", this.updateEdge, this);
			}
		}

		for (let i = 0; i <= gridWidth; i++) {
			for (let j = 0; j <= gridHeight; j++) {
				const { x, y } = toCoord(i, j);
				const corner = new Corner(scene, i, j, x, y, size);
				this.corners.push(corner);
				this.add(corner);
			}
		}

		/* Link objects */

		// Link every cell with its 4 edges
		this.cells.forEach((cell) => {
			const { i, j } = cell;
			this.edges.forEach((edge) => {
				if (
					(edge.i === i - 0.5 && edge.j === j) ||
					(edge.i === i + 0.5 && edge.j === j) ||
					(edge.i === i && edge.j === j - 0.5) ||
					(edge.i === i && edge.j === j + 0.5)
				) {
					cell.addEdge(edge);
					edge.addCell(cell);
				}
			});
		});

		// Link every corner with its 2 to 4 edges
		this.corners.forEach((corner) => {
			const { i, j } = corner;
			this.edges.forEach((edge) => {
				if (
					(edge.i === i && edge.j === j - 0.5) ||
					(edge.i === i && edge.j === j + 0.5) ||
					(edge.i === i - 0.5 && edge.j === j) ||
					(edge.i === i + 0.5 && edge.j === j)
				) {
					corner.addEdge(edge);
					edge.addCorner(corner);
				}
			});
		});

		this.cells.forEach((cell) => cell.update());
		this.corners.forEach((corner) => corner.update());
		this.edges.forEach((edge) => edge.update());
	}

	updateEdge(edge: Edge) {
		edge.cells.forEach((cell) => cell.update());
		edge.corners.forEach((corner) => corner.update());

		const uniqueEdges = new Set<Edge>([
			...edge.cells.flatMap((cell) => cell.edges),
			...edge.corners.flatMap((corner) => corner.edges),
		]);
		uniqueEdges.forEach((e) => e.update());

		for (const cell of edge.cells) {
			const { group, contained } = this.getFloodFilledGroup(cell);
			group.forEach((cell) => {
				if (cell.filled != contained) {
					cell.filled = contained;
					cell.update();
				}
			});
		}
	}

	getFloodFilledGroup(startCell: Cell): {
		group: Set<Cell>;
		contained: boolean;
	} {
		const group = new Set<Cell>();
		const queue: Cell[] = [startCell];
		let contained = true;

		while (queue.length > 0) {
			const cell = queue.pop()!;
			if (group.has(cell)) {
				continue;
			}
			if (cell.outside) {
				contained = false;
			}
			group.add(cell);

			for (const neighbor of cell.neighbors) {
				if (!group.has(neighbor)) {
					queue.push(neighbor);
				}
			}
		}

		return { group, contained };
	}
}

class Cell extends Phaser.GameObjects.Container {
	public i: number;
	public j: number;
	public value: number;
	public edges: Edge[];
	public filled: boolean;

	private background: Phaser.GameObjects.Image;
	private text: Phaser.GameObjects.Text;

	constructor(
		scene: BaseScene,
		i: number,
		j: number,
		x: number,
		y: number,
		size: number,
		value: number
	) {
		super(scene, x, y);
		this.i = i;
		this.j = j;
		this.edges = [];
		this.value = value;
		this.filled = false;

		this.background = scene.add.image(0, 0, "square");
		this.background.setScale(size / this.background.width);
		this.background.setTint(Color.Red200);
		this.add(this.background);

		this.text = scene.addText({
			text: value.toString(),
			size: size / 2.25,
			color: "black",
		});
		this.text.setOrigin(0.5);
		this.text.setVisible(value >= 0);
		this.add(this.text);

		// scene.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
		// 	const distance = Phaser.Math.Distance.Between(
		// 		pointer.x,
		// 		pointer.y,
		// 		this.x + scene.CX,
		// 		this.y + scene.CY
		// 	);
		// 	this.setAlpha(Math.max(1 - distance / 200, 0));
		// });
	}

	addEdge(edge: Edge) {
		this.edges.push(edge);
	}

	update() {
		const count = this.edges.filter((edge) => edge.mode != "blank").length;
		this.text.setAlpha(count > 0 ? 1 : 0.5);
		this.text.setColor(this.error ? "red" : "black");
		this.background.setVisible(this.filled);
	}

	get error() {
		if (this.value < 0) return false;
		if (this.filled) return true;
		const lines = this.edges.filter((edge) => edge.mode == "line").length;
		const crosses = this.edges.filter((edge) => edge.mode == "cross").length;
		return lines > this.value || crosses > 4 - this.value;
	}

	get neighbors() {
		return this.edges
			.filter((edge) => !edge.isOn)
			.flatMap((edge) => edge.cells)
			.filter((cell) => cell !== this);
	}

	get outside() {
		return this.edges.some((edge) => edge.cells.length === 1 && !edge.isOn);
	}
}

class Corner extends Phaser.GameObjects.Container {
	public i: number;
	public j: number;
	public edges: Edge[];

	private circle: Phaser.GameObjects.Image;

	constructor(
		scene: BaseScene,
		i: number,
		j: number,
		x: number,
		y: number,
		size: number
	) {
		super(scene, x, y);
		this.i = i;
		this.j = j;
		this.edges = [];

		this.circle = scene.add.image(0, 0, "circle");
		this.circle.setScale((0.24 * size) / this.circle.width);
		this.circle.setTint(0x000000);
		this.add(this.circle);
	}

	addEdge(edge: Edge) {
		this.edges.push(edge);
	}

	update() {
		const count = this.edges.filter((edge) => edge.isOn).length;
		this.circle.setAlpha(count > 0 ? 1 : 0.5);
		this.circle.setTint(this.error ? 0xff0000 : 0x000000);
		// this.edges.forEach((edge) => edge.update());
	}

	get error() {
		const lines = this.edges.filter((edge) => edge.mode == "line").length;
		const crosses = this.edges.filter((edge) => edge.mode == "cross").length;
		const max = this.edges.length;
		return lines > 2 || (lines == 1 && crosses == max - 1);
	}
}

type EdgeMode = "blank" | "line" | "cross";
let draggingMode: EdgeMode = "line";
let recentCorner: Corner | null = null;

class Edge extends Phaser.GameObjects.Container {
	public i: number;
	public j: number;
	public corners: Corner[];
	public cells: Cell[];
	public mode: EdgeMode;
	public hasCycle: boolean;

	private line: Phaser.GameObjects.Image;
	private cross: Phaser.GameObjects.Text;
	private hintText: Phaser.GameObjects.Text;

	constructor(
		scene: BaseScene,
		i: number,
		j: number,
		x: number,
		y: number,
		size: number,
		vertical: boolean
	) {
		super(scene, x, y);
		this.i = i;
		this.j = j;
		this.corners = [];
		this.cells = [];
		this.mode = "blank";
		this.hasCycle = false;

		this.line = scene.add.image(0, 0, "line");
		this.line.setScale(size / 128);
		this.line.setTint(0x000000);
		this.line.setVisible(false);
		if (vertical) this.line.setAngle(90);
		this.add(this.line);

		this.cross = scene.addText({
			y: -1,
			text: "x",
			size: size / 2.5,
			color: "red",
		});
		this.cross.setOrigin(0.5);
		this.cross.setVisible(false);
		this.add(this.cross);

		this.hintText = scene.addText({
			y: -1,
			text: "?",
			size: size / 2.5,
			color: "#ffbb00",
		});
		this.hintText.setOrigin(0.5);
		this.hintText.setVisible(false);
		this.add(this.hintText);

		const clickArea = scene.add.image(0, 0, "hitarea1");
		clickArea.setAlpha(0.01);
		clickArea.setScale(size / 128);
		this.add(clickArea);
		clickArea
			.setInteractive(scene.input.makePixelPerfect(1))
			.on("pointerdown", this.onClick, this);

		const dragArea = scene.add.image(0, 0, "hitarea2");
		dragArea.setAlpha(0.01);
		dragArea.setScale(size / 128);
		this.add(dragArea);
		dragArea
			.setInteractive(scene.input.makePixelPerfect(1))
			.on("pointerdown", this.onClick, this)
			.on("pointerover", this.onOver, this);
	}

	addCorner(corner: Corner) {
		this.corners.push(corner);
	}

	addCell(cell: Cell) {
		this.cells.push(cell);
	}

	setMode(mode: EdgeMode) {
		this.mode = mode;
		this.line.setVisible(mode == "line");
		this.cross.setVisible(mode == "cross");
	}

	onClick(pointer: Phaser.Input.Pointer) {
		let mode: EdgeMode = pointer.leftButtonDown() ? "line" : "cross";
		if (this.mode == mode) mode = "blank";
		this.setMode(mode);
		draggingMode = mode;
		recentCorner = this.corners[0];
		this.emit("update", this);
	}

	onOver(pointer: Phaser.Input.Pointer) {
		if (pointer.isDown) {
			const hasChanged = this.mode != draggingMode;
			this.setMode(draggingMode);
			if (hasChanged) this.emit("update", this);
		}
	}

	update() {
		this.line.setTint(this.error ? 0xff0000 : 0x000000);
		this.hintText.setVisible(this.hint);
	}

	get error() {
		return this.hasCycle || this.corners.some((corner) => corner.error);
	}

	get hint() {
		return false;
		if (this.mode != "blank") return false;

		const check = (mode: EdgeMode) => {
			this.mode = mode;
			if (this.cells.some((cell) => cell.error)) return true;
			if (this.corners.some((corner) => corner.error)) return true;
			return false;
		};
		const currentMode = this.mode;
		const anyErrors = check("line") || check("cross");
		this.mode = currentMode;
		return anyErrors;
	}

	get isOn(): boolean {
		return this.mode === "line";
	}
}
