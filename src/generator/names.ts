import { animals, appearanceWords } from "./words";

function capitalize(word: string) {
	return word.charAt(0).toUpperCase() + word.slice(1);
}

export function getRandomUsername() {
	const appearance = Phaser.Math.RND.pick(appearanceWords);
	const animal = Phaser.Math.RND.pick(animals);

	return `${capitalize(appearance)}${capitalize(animal)}`;
}
