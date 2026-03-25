import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma.module';
import { ProjectModule } from './modules/project/project.module';
import { AuthModule } from './modules/auth/auth.module';
import { UploadModule } from './modules/upload/upload.module';
import { BlogModule } from './modules/blog/blog.module';
import { ServiceModule } from './modules/service/service.module';
import { ProductModule } from './modules/product/product.module';
import { ContactRequestModule } from './modules/contact-request/contact-request.module';
import { HomepageSlideModule } from './modules/homepage-slide/homepage-slide.module';
import { FavoritesModule } from './modules/favorites/favorites.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ProjectModule,
    UploadModule,
    BlogModule,
    ServiceModule,
    ProductModule,
    ContactRequestModule,
    HomepageSlideModule,
    FavoritesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
