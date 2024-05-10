import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateBackupDto {
    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    filename: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(255)
    publicId: string;

    @ApiProperty()
    @IsString()
    secureUrl: string;

    @ApiProperty()
    @IsString()
    url: string;

    @ApiProperty()
    @IsString()
    resourceType: string;

    @ApiProperty()
    @IsNumber()
    bytes: number;

    @ApiProperty()
    @IsString()
    lastMod: string;
}
