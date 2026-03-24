import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class ReplyContactRequestDto {
    @IsString()
    @IsOptional()
    @MaxLength(180, { message: 'Tiêu đề tối đa 180 ký tự' })
    subject?: string;

    @IsString()
    @IsNotEmpty({ message: 'Nội dung phản hồi không được để trống' })
    @MaxLength(5000, { message: 'Nội dung phản hồi quá dài' })
    message!: string;
}

