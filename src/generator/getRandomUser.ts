import { User } from "../users/User";
import { FruitLover } from "../users/FruitLover";
import { NormalFurry } from "../users/NormalFurry";

export function getRandomUser(): User {
	const userClass = Phaser.Math.RND.pick([
		NormalFurry,
		FruitLover,
	]);
	return new userClass();
}
