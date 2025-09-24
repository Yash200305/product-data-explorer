// backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

// Feature modules (adjust paths to match your project)
import { NavigationModule } from './navigation/navigation.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { ReviewModule } from './review/review.module';
import { ScraperModule } from './scraper/scraper.module';
import { CacheModule } from './common/cache/cache.module';

@Module({
  imports: [
    // Loads .env; if starting from repo root, set envFilePath: 'backend/.env'
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: 'backend/.env',
    }),

    // Global rate limiting; array syntax is required in current versions
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 60 seconds
        limit: 60,  // 60 requests per window per IP
      },
    ]),

    // DB connection using env vars; autoLoadEntities picks up forFeature entities
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres' as const,
        host: config.get<string>('DB_HOST') ?? 'localhost',
        port: config.get<number>('DB_PORT') ?? 5432,
        username: config.get<string>('DB_USERNAME') ?? 'postgres',
        password: config.get<string>('DB_PASSWORD') ?? '',
        database: config.get<string>('DB_NAME') ?? 'product_explorer',
        autoLoadEntities: true,
        synchronize: false, // use migrations in prod
      }),
    }),

    // Application modules
    CacheModule,
    ScraperModule,
    NavigationModule,
    CategoryModule,
    ProductModule,
    ReviewModule,
  ],
  providers: [
    // Apply throttling globally
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
