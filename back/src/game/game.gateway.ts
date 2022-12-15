import { OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { userInfo } from 'os';
import { Socket, Namespace } from 'socket.io';
import { User } from 'src/database';
import { NotifData, Room } from 'src/utils/types';
import { GameService } from './game.service';
import { RoomService } from './room.service';

@WebSocketGateway(3003, {
  cors: {
    origin: 'http://localhost:3000',
  },
  namespace: 'game',
})

export class GameGateway {
  constructor(
    private readonly roomService: RoomService,
    private readonly gameService: GameService,
  ) { }

  @WebSocketServer() server: Namespace;

  @SubscribeMessage('login')
  login(client: Socket, userId: number) {
    this.gameService.users.set(userId, client.id);
  }

  @SubscribeMessage('loggout')
  logout(client: Socket, userId: number) {
    this.gameService.users.delete(userId)
  }

  @SubscribeMessage('joinRoom')
  joinRoom(client: Socket, data: any) {
    console.log('join event')
    const oldRoom = this.roomService.usersRooms.get(data.user.id);
    const room = this.roomService.joinRoom(data);

    if (!room)
      this.server.to(client.id).emit('error', `couldn't join room : room full`)
    else {
      console.log('return room', room);
      if (oldRoom) {
        const leaveData = {
          roomId: oldRoom.id,
          userId: data.user.id,
        }
        this.leaveRoom(client, leaveData);
      }
      this.roomService.usersRooms.set(data.user.id, room);
      client.join(room.id);
      this.server.to(room.id).emit('joinedRoom', room);
    }
  }

  @SubscribeMessage('join')
  join(client: Socket, roomId: string) {
    client.join(roomId);
  }

  @SubscribeMessage('leaveRoom')
  leaveRoom(client: Socket, data: any) {
    console.log('leave room event')
    const room = this.roomService.leaveRoom(data.roomId, data.userId);
    const left = {
      userId: data.userId,
      room
    };

    console.log(`client ${data.userId} left`)
    client.to(data.roomId).emit('leftRoom', left);
    this.server.to(client.id).emit('clearRoom');
    client.leave(data.roomId);
  }

  @SubscribeMessage('spectate')
  spectate(client: Socket, data: any) {
    console.log('spectatate event');
    const room = this.roomService.usersRooms.get(data.user.id);

    if (!room)
      this.server.to(client.id).emit('error', `user ${data.user.username} is not currently in a game`);
    else {
      this.roomService.addSpectator(data.me, room);
      client.join(room.id);
      this.server.to(room.id).emit('joinedRoom', room);
    }

  }
}
