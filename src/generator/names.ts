import appearance from "./adjectives/appearance.json";
import animals from "@/generator/nouns/animals.json";

function capitalize(word: string) {
	return word.charAt(0).toUpperCase() + word.slice(1);
}

export function getRandomUsername() {
	const adj = Phaser.Math.RND.pick(appearance);
	const noun = Phaser.Math.RND.pick(animals);

	return `${capitalize(adj)}${capitalize(noun)}`;
}
