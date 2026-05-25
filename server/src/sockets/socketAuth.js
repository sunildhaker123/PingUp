import { User } from '../models/User.js';
import { verifyAccessToken } from '../utils/token.js';

export const socketAuth = async (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.replace('Bearer ', '');

    if (!token) {
      return next(new Error('Socket authentication token is required'));
    }

    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub).select('-password');

    if (!user) {
      return next(new Error('Socket user not found'));
    }

    socket.user = user;
    return next();
  } catch {
    return next(new Error('Socket authentication failed'));
  }
};
