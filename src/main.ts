import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as process from 'node:process';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: ['log', 'fatal', 'error', 'warn', 'debug', 'verbose'],
    });

    app.useGlobalPipes(new ValidationPipe());

    app.enableCors({
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });

    app.use(cookieParser());

    app.setGlobalPrefix('api');

    const logger = new Logger('Main');

    if (process.env.DEV === 'true') {
        logger.verbose('Starting in DEV mode');
        const config = new DocumentBuilder()
            .setTitle('Educloud API')
            .setDescription('The Educloud API description')
            .setVersion('1.0')
            .addTag('Educloud')
            .build();
        const documentFactory = () => SwaggerModule.createDocument(app, config);

        SwaggerModule.setup('swagger', app, documentFactory);
        logger.debug(`Swagger started on port ${process.env.PORT ?? 3300}/swagger`);
    }

    await app.listen(process.env.PORT ?? 3300);
    logger.log(`Server started on port ${process.env.PORT ?? 3300}`);
}

bootstrap();
