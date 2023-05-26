import { IsOptional, IsString, IsEmail, MaxLength, MinLength, Matches, IsBoolean } from 'class-validator';

export class CreateUserDto {
	@IsEmail()
	@IsString()
	email: string;

	@IsString()
	@MinLength(6)
	@MaxLength(50)
	@Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
		message: 'The password must have a Uppercase, lowercase letter and a number',
	})
	password: string;

	@IsString()
	@MinLength(3)
	@MaxLength(50)
	name: string;

	@IsOptional()
	@IsString()
	@MinLength(3)
	lastName?: string;

	@IsBoolean()
	@IsOptional()
	isActive?: boolean;
}
