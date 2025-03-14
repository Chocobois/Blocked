import { getRandomUsername } from "@/generator/names";
import { BaseScene } from "@/scenes/BaseScene";
import { Color } from "@/util/colors";

export class ProfileImage extends Phaser.GameObjects.Container {
	public scene: BaseScene;

	private size: number;
	private color: number;

	// private circleMask: Phaser.Display.Masks.BitmapMask;
	private username: Phaser.GameObjects.Text;

	constructor(scene: BaseScene, x: number, y: number, size: number) {
		super(scene, x, y);
		scene.add.existing(this);
		this.scene = scene;
		this.size = size;

		// const circle = scene.make.ep({x, y, });
		// const circle = scene.add.image(x, y, "circle");
		// this.circleMask = circle.createBitmapMask();

		// const circle = scene.add.circle(0, 0, size / 2, 0xff0000, 0.5);
		// this.add(circle);

		this.color = Phaser.Math.RND.pick([
			Color.Red300,
			Color.Orange300,
			Color.Amber300,
			Color.Yellow300,
			Color.Lime300,
			Color.Green300,
			Color.Emerald300,
			Color.Teal300,
			Color.Cyan300,
			Color.Sky300,
			Color.Blue300,
			Color.Indigo300,
			Color.Violet300,
			Color.Purple300,
			Color.Fuchsia300,
			Color.Pink300,
			Color.Rose300,
		]);

		this.addPart(["profile_body1", "profile_body2", "profile_body3"]);
		this.addPart(["profile_head1", "profile_head2", "profile_head3"]);
		this.addPart(["profile_mouth1", "profile_mouth2", "profile_mouth3"]);
		this.addPart(["profile_eyes1", "profile_eyes2", "profile_eyes3"]);
		this.addPart(["profile_hair1", "profile_hair2", "profile_hair3", "empty"]);

		this.username = scene.addText({
			x: 0,
			y: size / 2 + 10,
			text: getRandomUsername(),
			size: 0.1 * size,
			weight: 700,
			color: "black",
		});
		this.username.setOrigin(0.5);
		this.add(this.username);
	}

	addPart(keys: string[]) {
		const key = Phaser.Math.RND.pick(keys);
		const image = this.scene.add.image(0, 0, key);

		image.setScale(this.size / image.width);

		// image.setMask(this.circleMask);

		image.setTint(this.color);

		this.add(image);
	}
}
