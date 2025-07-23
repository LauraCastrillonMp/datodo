import { IsEmail, IsEnum, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 100)
  password: string;

  @IsEnum(['admin', 'teacher', 'student'])
  role: 'admin' | 'teacher' | 'student';

  @IsString()
  @Length(3, 100)
  name: string;

  @IsString()
  @Length(3, 50)
  username: string;
}
