import { Image, SpriteSheet, Audio } from "./util";
import { image, sound, music, loadFont, spritesheet } from "./util";

/* Spritesheets */
const spritesheets: SpriteSheet[] = [];

/* Audios */
const audios: Audio[] = [
	music("title.mp3", "m_main_menu"),
	music("first.mp3", "m_first"),
	sound("tree/rustle.mp3", "t_rustle", 0.5),
];

/* Images */
const images: Image[] = [];

// Load all images in root folder
for (const path in import.meta.glob("./images/*")) {
	const file = path.split("/").pop()!;
	const key = file.split(".").shift()!;
	images.push(image(file, key));
}

// Load all images in subfolders
for (const path in import.meta.glob("./images/*/*")) {
	const parts = path.split("/");
	const folder = parts[parts.length - 2];
	const file = parts[parts.length - 1];
	const key = file.split(".")[0];
	images.push(image(`${folder}/${file}`, `${folder}_${key}`));
}

/* Fonts */
await loadFont("DynaPuff-Medium", "Game Font");

export { images, spritesheets, audios };
