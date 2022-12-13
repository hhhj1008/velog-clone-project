require('dotenv').config();

import { HttpCode, HttpStatus, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from 'config/config.service';
import * as fs from 'fs';
import { GlobalExceptionFilter } from './exception/globalExceptionFilter';
import * as cors from 'cors';
import { ServerResponse } from 'http';
import { HttpStatusCode } from 'axios';

async function bootstrap() {
  await makeOrmConfig();

  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:5173'],
    credentials: true,
    optionsSuccessStatus: HttpStatus.OK,
  });

  // app.use((req, res: ServerResponse, next) => {
  //   console.log('origin', req.headers.origin);
  //   const corsWhitelist = [
  //     'http://localhost:8000',
  //     'http://localhost:5173',
  //     'https://accounts.google.com',
  //   ];
  //   if (corsWhitelist.indexOf(req.headers.origin) !== -1) {
  //     console.log('CORS whitelist');
  //     res.setHeader('Access-Control-Allow-Origin', corsWhitelist);
  //   }

  //   next();
  // });

  // const corsOptions = {
  //   origin: 'http://localhost:5173, http://localhost:8000',
  //   headers:
  //     'access-control-allow-origin, X-Requested-With, Content-Type, Accept, access-control-allow-methods',
  //   methods: 'GET' || 'POST' || 'PUT' || 'DELETE' || 'PATCH' || 'OPTIONS',
  //   credentials: true,
  //   preflight: true,
  //   Vary: 'http://localhost:5173, http://localhost:8000',
  // };

  // const corsWhitelist = [
  //   'http://localhost:8000',
  //   'http://localhost:5173',
  //   'https://accounts.google.com',
  // ];
  // app.enableCors({
  //   origin: '*',
  //   allowedHeaders: [
  //     'Access-Control-Allow-Origin',
  //     'Access-Control-Allow-Methods',
  //     'Access-Control-Allow-Headers',
  //     'X-Requested-With',
  //     'Content-Type',
  //     'Accept',
  //     'authorization',
  //   ],
  //   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  //   preflightContinue: false,
  // });

  // app.use(function (req, res, next) {
  //   res.addHeader('Access-Control-Allow-Origin', '*');
  //   res.addHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  //   next();
  // });
  // const origin = ['http://localhost:5173, http://localhost:8000'];

  // app.use(cors());

  // http://localhost:8000/auth/google/callback?code=4%2F0AfgeXvu697B26rbVDtbPbFnyj79tF7Zrwhk_nASN10xgoOfvsRmEUokN_QYC0r9ExoXAWA&scope=email+profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+openid&authuser=0&prompt=consent

  app.useGlobalFilters(new GlobalExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env.SERVER_POST);
}

async function makeOrmConfig() {
  const configService = new ConfigService(process.env);
  const typeormConfig = configService.getTypeOrmConfig();

  if (fs.existsSync('ormconfig.json')) {
    fs.unlinkSync('ormconfig.json');
  }

  fs.writeFileSync('ormconfig.json', JSON.stringify(typeormConfig, null, 2));
}

bootstrap();
