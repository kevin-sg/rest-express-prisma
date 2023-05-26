import { IsString, MinLength, MaxLength, IsOptional, IsBoolean, IsNumber, IsInt, IsPositive } from 'class-validator';

export class UpdatePostDto {
	@IsOptional()
	@IsString()
	@MaxLength(50)
	@MinLength(4)
	title?: string;

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
	userId?: boolean;
}
