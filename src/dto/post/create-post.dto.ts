import { IsString, MinLength, MaxLength, IsOptional, IsBoolean, IsInt, IsNumber, IsPositive } from 'class-validator';

export class CreatePostDto {
	@IsString()
	@MinLength(4)
	@MaxLength(50)
	title: string;

	@IsOptional()
	@IsString()
	@MaxLength(250)
	@MinLength(4)
	content?: string;

	@IsBoolean()
	@IsOptional()
	published?: boolean;

	@IsInt()
	@IsNumber()
	@IsOptional()
	@IsPositive()
	userId?: number;
}
