import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/auth/auth.module";
import {
  Channel,
  ChanMessage,
  Notif,
  User,
  Restriction,
  DirectMessages,
} from "src/database";
import { GameModule } from "src/game/game.module";
import { RoomService } from "src/game/room.service";
import { NotifService } from "src/users/notifs.service";
import { UsersModule } from "src/users/users.module";
import { ChatGateway } from "./chat.gateway";
import { ChatService } from "./chat.service";
import { ChannelService } from "./channel.service";
import { ChatController } from "./chat.controller";
import { MessageService } from "./message.service";
import { RestrictionService } from "./restrictions.service";

@Module({
  controllers: [ChatController],
  imports: [
    UsersModule,
    AuthModule,
    GameModule,
    TypeOrmModule.forFeature([
      Notif,
      Channel,
      User,
      ChanMessage,
      Restriction,
      DirectMessages,
    ]),
  ],
  providers: [
    ChatGateway,
    ChatService,
    NotifService,
    RoomService,
    ChannelService,
    MessageService,
    RestrictionService,
  ],
})
export class ChatModule {}
