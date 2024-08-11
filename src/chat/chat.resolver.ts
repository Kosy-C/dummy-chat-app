/* eslint-disable prettier/prettier */
import { Resolver, Mutation, Args, Subscription, ObjectType, Field, Query } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { v4 as uuidv4 } from 'uuid';

const pubSub = new PubSub();

@ObjectType()
export class ChatRooms {
  @Field()
  roomId: string;
}

@ObjectType()
export class Payload {
    @Field()
    roomId: string;
    @Field()
    message: string;
    @Field()
    sender: string;
}

@ObjectType()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class DummyQuery {
  @Query(() => String)
  dummyQuery(): string {
    return "This is a dummy query.";
  }
}

@Resolver('Chat')
export class ChatResolver {
    private chatRooms: Record<string, string[]> = {};

    @Mutation(() => ChatRooms)
    async createChatRoom(): Promise<ChatRooms>  {
        const roomId = uuidv4();
        this.chatRooms[roomId] = [];
        return { roomId } ;
    }

    @Mutation( () => ChatRooms)
    async joinChatRoom(@Args('roomId') roomId: string) {
        if (!this.chatRooms[roomId]) {
            throw new Error(`Chat room with id '${roomId}' not found`);
        }
        return { roomId };
    }

    @Mutation( () => Payload)
    async sendMessage(
        @Args('roomId') roomId: string,
        @Args('message') message: string,
        @Args('sender') sender: string,
    ) {
        if (!this.chatRooms[roomId]) {
            throw new Error(`Chat room with id '${roomId}' not found`);
        }

        const payload = { roomId, sender, message };
        console.log('Publishing payload:', payload);
        
        pubSub.publish(`newMessage - ${roomId}`, { newMessage: payload });
        return payload;
    }

    @Subscription(() => Payload, {
        resolve: (payload) => payload.newMessage,  // Ensure the payload has the `newMessage` field
        filter: (payload, variables) =>
          payload.newMessage.roomId === variables.roomId,  // Filter based on roomId
      })
      newMessage(@Args('roomId') roomId: string) {
        return pubSub.asyncIterator(`newMessage - ${roomId}`);
      }      

    @Query(() => String)
    dummyQuery(): string {
      return "This is a dummy query.";
    }
}
