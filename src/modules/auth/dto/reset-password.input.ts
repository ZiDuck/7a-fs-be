import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class ResetPasswordInput {
    @ApiProperty()
    @IsOptional()
    @IsEmail()
    readonly email: string;

    @ApiProperty()
    @IsString()
    @MinLength(6)
    @MaxLength(255)
    readonly newPassword: string;

    @ApiProperty()
    @Allow()
    readonly newPasswordToken: string;

    @ApiProperty()
    @Allow()
    readonly currentPassword: string;
}
