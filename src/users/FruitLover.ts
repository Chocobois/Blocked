import { User } from "./User";
import { capitalize } from "@/util/functions";
import size from "@/generator/adjectives/size.json";
import fruits from "@/generator/nouns/fruits.json";

export class FruitLover extends User {
	generateName() {
		const adj = Phaser.Math.RND.pick(size);
		const noun = Phaser.Math.RND.pick(fruits);
		return `${capitalize(adj)}${capitalize(noun)}`;
	}
}
