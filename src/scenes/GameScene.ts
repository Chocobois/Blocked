import { BaseScene } from "@/scenes/BaseScene";
import { ProfileImage } from "@/components/ProfileImage";
import { getRandomUser } from "@/generator/getRandomUser";
import { Tweet } from "@/components/Tweet";
import { Slitherlink } from "@/components/Slitherlink";
import { level1, level2, level3, level4, level5, level6 } from "@/components/levels";
import { interpolateColor } from "@/util/functions";

export class GameScene extends BaseScene {
	constructor() {
		super({ key: "GameScene" });
	}

	create(): void {
		this.fade(false, 200, 0x000000);
		this.cameras.main.setBackgroundColor(0xffffff);
		this.input.mouse?.disableContextMenu();

		/* Spawn random profiles */
		// const n = 6;
		// const size = 1000 / n;
		// for (let i = 0; i < n; i++) {
		// 	for (let j = 0; j < n; j++) {
		// 		const x = this.CX + size * (i - n / 2 + 0.5);
		// 		const y = this.CY + size * (j - n / 2 + 0.5);
		// 		const user = getRandomUser();
		// 		const profile = new ProfileImage(this, x, y, size, user);
		// 	}
		// }

		// const user = getRandomUser();
		// const tweet = new Tweet(this, this.CX, this.CY, user);

		const puzzle = new Slitherlink(this, this.CX, this.CY, level6);
	}

	update(time: number, delta: number) {}
}
