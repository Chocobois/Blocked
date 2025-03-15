import { BaseScene } from "@/scenes/BaseScene";
import { User } from "@/users/User";
import emojis from "@/generator/emojis/all.json";
import { ProfileImage } from "./ProfileImage";

export class Tweet extends Phaser.GameObjects.Container {
	public scene: BaseScene;
	public user: User;

	private image: Phaser.GameObjects.Image;
	private text: Phaser.GameObjects.Text;

	constructor(scene: BaseScene, x: number, y: number, user: User) {
		super(scene, x, y);
		scene.add.existing(this);
		this.scene = scene;
		this.user = user;

		const imageSize = 512;
		const profileSize = 128;

        const px = -imageSize / 2 + profileSize / 2;
		const py = -imageSize / 2 - profileSize / 2;
		const profile = new ProfileImage(scene, px, py, profileSize, user);
		this.add(profile);

		const key = Phaser.Math.RND.pick([
			"placeholder1",
			"placeholder2",
			"placeholder3",
		]);
		this.image = scene.add.image(0, 0, key);
		this.image.setScale(imageSize / this.image.width);
		this.add(this.image);

		const emoji = Phaser.Math.RND.pick(emojis);
		this.text = scene.addText({
			x: 0,
			y: imageSize / 2 + 16,
			text: `Love it here in Seattle! ${emoji}`,
			size: 32,
			color: "black",
		});
		this.text.setOrigin(0.5, 0);
		this.add(this.text);
	}
}
