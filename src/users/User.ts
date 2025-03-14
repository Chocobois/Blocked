export class User {
	public name: string;

	constructor() {
		this.name = this.generateName();
	}

	generateName(): string {
		return "User";
	}
}
