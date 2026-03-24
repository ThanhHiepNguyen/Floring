import { IsIn, IsOptional, IsString } from 'class-validator';
import { CONTACT_REQUEST_STATUS_VALUES } from './create-contact-request.dto';

export class UpdateContactRequestDto {
    @IsString()
    @IsOptional()
    @IsIn(CONTACT_REQUEST_STATUS_VALUES, { message: 'Trạng thái không hợp lệ' })
    status?: string;
}

