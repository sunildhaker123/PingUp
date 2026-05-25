export const SOCKET_EVENTS = {
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',

  USER_ONLINE: 'user:online',
  USER_OFFLINE: 'user:offline',

  ROOM_JOIN: 'room:join',
  ROOM_JOINED: 'room:joined',
  ROOM_LEAVE: 'room:leave',
  ROOM_LEFT: 'room:left',

  MESSAGE_SEND: 'message:send',
  MESSAGE_NEW: 'message:new',
  MESSAGE_BROADCAST: 'message:broadcast',

  TYPING_START: 'typing:start',
  TYPING_STOP: 'typing:stop',

  SOCKET_ERROR: 'socket:error',
};
