import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import Redis from 'ioredis';
import { PrismaService } from 'src/prisma.service';

const FAVORITE_TTL_SECONDS = 60 * 60 * 24 * 30; // 1 month

@Injectable()
export class FavoritesService {
  private readonly redis: Redis;

  constructor(private readonly prisma: PrismaService) {
    const redisUrl = process.env.REDIS_URL?.trim();
    const resolvedRedisUrl = redisUrl || 'redis://localhost:6379';

    this.redis = new Redis(resolvedRedisUrl, {
      maxRetriesPerRequest: 2,
    });

    // Prevent ioredis connection errors from bubbling as "Unhandled error event".
    // If Redis is down/misconfigured, API calls will still fail gracefully.
    this.redis.on('error', () => {
      // intentionally ignore; frontend catches failures and keeps UI unchanged
    });
  }

  private getKey(userId: string) {
    return `floring:favorites:${userId}`;
  }

  async toggleFavorite(userId: string, permalink: string): Promise<{ isFavorite: boolean; count: number }> {
    const clean = permalink.trim();
    if (!clean) throw new BadRequestException('permalink không hợp lệ');

    // Optionally validate that permalink exists (prevents storing junk).
    const exists = await this.prisma.product.findUnique({
      where: { slug: clean },
      select: { id: true },
    });
    if (!exists) throw new BadRequestException('Sản phẩm không tồn tại');

    const key = this.getKey(userId);
    const currentlyFavorite = await this.redis.sismember(key, clean);

    if (currentlyFavorite) {
      await this.redis.srem(key, clean);
      const count = await this.redis.scard(key);
      if (count === 0) await this.redis.del(key);
      return { isFavorite: false, count };
    }

    await this.redis.sadd(key, clean);
    // Refresh TTL on every add so favorites stay for 1 month after the last interaction.
    await this.redis.expire(key, FAVORITE_TTL_SECONDS);

    const count = await this.redis.scard(key);
    return { isFavorite: true, count };
  }

  async getFavoritePermalinks(userId: string): Promise<string[]> {
    const key = this.getKey(userId);
    const members = await this.redis.smembers(key);
    return members;
  }
}

