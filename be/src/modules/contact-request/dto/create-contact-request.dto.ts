import { IsArray, IsEmail, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export const CONTACT_REQUEST_STATUS_VALUES = ['new', 'pending', 'contacted', 'completed', 'cancelled'] as const;

export class CreateContactRequestDto {
    @IsString()
    @IsNotEmpty({ message: 'Tên không được để trống' })
    name!: string;

    @IsString()
    @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
    phone!: string;

    @IsEmail({}, { message: 'Email không hợp lệ' })
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    message?: string;

    @IsString()
    @IsOptional()
    @IsIn(CONTACT_REQUEST_STATUS_VALUES, { message: 'Trạng thái không hợp lệ' })
    status?: string;

    @IsString()
    @IsOptional()
    serviceId?: string;

    @IsString()
    @IsOptional()
    productVariantId?: string;

    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    imageUrls?: string[];
}

