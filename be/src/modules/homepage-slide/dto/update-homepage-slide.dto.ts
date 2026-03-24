import { PartialType } from '@nestjs/mapped-types';
import { CreateHomepageSlideDto } from './create-homepage-slide.dto';

export class UpdateHomepageSlideDto extends PartialType(CreateHomepageSlideDto) {}

