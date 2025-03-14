import { BaseScene } from "@/scenes/BaseScene";
import { ProfileImage } from "@/components/ProfileImage";
import { UI } from "@/components/UI";

export class GameScene extends BaseScene {
	private background: Phaser.GameObjects.Image;
	private ui: UI;

	constructor() {
		super({ key: "GameScene" });
	}

	create(): void {
		this.fade(false, 200, 0x000000);
		this.cameras.main.setBackgroundColor(0xffffff);

		/* Spawn random profiles */
		const n = 5;
		const size = 1000 / n;
		for (let i = 0; i < n; i++) {
			for (let j = 0; j < n; j++) {
				const x = this.CX + size * (i - n / 2 + 0.5);
				const y = this.CY + size * (j - n / 2 + 0.5);
				const profile = new ProfileImage(this, x, y, size);
			}
		}
	}

	update(time: number, delta: number) {}
}
