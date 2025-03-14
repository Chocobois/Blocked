import { User } from "../users/User";
import { FruitLover } from "../users/FruitLover";
import { NormalFurry } from "../users/NormalFurry";

export function getRandomUser(): User {
	return Phaser.Math.RND.pick([
		new NormalFurry(),
		new FruitLover(),
		// Whoops
	]);
}
