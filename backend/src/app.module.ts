import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { SalesModule } from './sales/sales.module';
import { WebsocketsModule } from './websockets/websockets.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    CategoriesModule,
    SalesModule,
    WebsocketsModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
