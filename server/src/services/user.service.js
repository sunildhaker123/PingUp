import { User } from '../models/User.js';

export const searchUsers = async ({ query, currentUserId }) => {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return [];
  }

  const users = await User.find({
    _id: { $ne: currentUserId },
    $or: [
      { name: { $regex: trimmedQuery, $options: 'i' } },
      { email: { $regex: trimmedQuery, $options: 'i' } },
      { phoneNumber: { $regex: trimmedQuery, $options: 'i' } },
    ],
  })
    .select('name email avatarUrl about isOnline lastSeenAt')
    .limit(12)
    .sort({ name: 1 });

  return users.map((user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    about: user.about,
    isOnline: user.isOnline,
    lastSeenAt: user.lastSeenAt,
  }));
};
