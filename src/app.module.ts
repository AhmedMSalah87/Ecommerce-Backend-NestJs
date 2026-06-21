import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/users/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development.local'],
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URL_ONLINE!, {
      dbName: 'ecommerce',
      serverSelectionTimeoutMS: 5000,
      onConnectionCreate: (connection: Connection) => {
        connection.on('connected', () =>
          console.log('connected to db sucessfully'),
        );

        return connection;
      },
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
