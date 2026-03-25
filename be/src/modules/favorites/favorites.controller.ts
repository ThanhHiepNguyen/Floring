import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import type { MaybeAuthenticatedRequest } from '../auth/auth.types';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { ToggleFavoriteDto } from './dto/toggle-favorite.dto';
import { FavoritesService } from './favorites.service';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get('permalinks')
  @UseGuards(OptionalJwtAuthGuard)
  async getFavoritePermalinks(@Req() req: MaybeAuthenticatedRequest) {
    const guestId = (req.headers['x-guest-id'] as string | undefined)?.trim();
    const userId = req.user?.id ?? guestId ?? 'guest:anonymous';
    const permalinks = await this.favoritesService.getFavoritePermalinks(userId);
    return { data: { permalinks } };
  }

  @Post('toggle')
  @UseGuards(OptionalJwtAuthGuard)
  async toggleFavorite(@Req() req: MaybeAuthenticatedRequest, @Body() dto: ToggleFavoriteDto) {
    const guestId = (req.headers['x-guest-id'] as string | undefined)?.trim();
    const userId = req.user?.id ?? guestId ?? 'guest:anonymous';
    const result = await this.favoritesService.toggleFavorite(userId, dto.permalink);
    return { data: result };
  }
}

