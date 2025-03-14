import { User } from "./User";
import { capitalize } from "@/util/functions";
import appearance from "@/generator/adjectives/appearance.json";
import animals from "@/generator/nouns/animals.json";

export class NormalFurry extends User {
	generateName() {
		const adj = Phaser.Math.RND.pick(appearance);
		const noun = Phaser.Math.RND.pick(animals);
		return `${capitalize(adj)}${capitalize(noun)}`;
	}
}
