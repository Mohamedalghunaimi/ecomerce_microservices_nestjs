import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0', // Use the service name defined in docker-compose.yml
        port: 3000, // Use the same port as defined in the AuthModule's ClientsModule registration
      },
    },
  );

  await app.listen();
}
bootstrap();
