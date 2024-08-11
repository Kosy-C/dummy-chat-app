import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import graphqlPlayground from 'graphql-playground-middleware-express';
// import { graphqlUploadExpress } from 'graphql-upload';
import { WsAdapter } from '@nestjs/platform-ws';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    '/playground',
    graphqlPlayground({
      endpoint: '/graphql',
    }),
  );

  // Use WebSocket adapter for subscriptions
  app.useWebSocketAdapter(new WsAdapter(app));

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}/graphql`);
}
bootstrap();
