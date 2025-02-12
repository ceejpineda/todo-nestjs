import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Username for the new account',
    example: 'johndoe',
    minLength: 4,
  })
  @IsString()
  @MinLength(4)
  username: string;

  @ApiProperty({
    description: 'Password for the new account',
    example: 'strongpassword123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;
}
