import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      installSubscriptionHandlers: true,
      playground: true,
      subscriptions: {
        'subscriptions-transport-ws': {
          onConnect: () => console.log('Connected'),
        },
      },
    }),
    ChatModule,
  ],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
