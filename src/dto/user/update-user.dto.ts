import { IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
	@IsEmail()
	@IsOptional()
	@IsString()
	email?: string;

	@IsOptional()
	@IsString()
	@MaxLength(50)
	@MinLength(6)
	@Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
		message: 'The password must have a Uppercase, lowercase letter and a number',
	})
	password?: string;

	@IsOptional()
	@IsString()
	@MaxLength(50)
	@MinLength(3)
	name?: string;

	@IsOptional()
	@IsOptional()
	@IsString()
	@MinLength(3)
	lastName?: string;
}
