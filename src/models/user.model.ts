export interface UserModel {
	name: string;
	lastName?: string;
	email: string;
	password?: string;
	isActive?: boolean;

	token?: string;

	// posts?: PostModel[];
}
