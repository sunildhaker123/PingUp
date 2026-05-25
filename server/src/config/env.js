import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

const encodeMongoCredentials = (uri) => {
  if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
    return uri;
  }

  const protocolSeparator = '://';
  const protocolEnd = uri.indexOf(protocolSeparator);
  const protocol = uri.slice(0, protocolEnd + protocolSeparator.length);
  const rest = uri.slice(protocolEnd + protocolSeparator.length);
  const pathStart = rest.search(/[/?]/);
  const authority = pathStart === -1 ? rest : rest.slice(0, pathStart);
  const suffix = pathStart === -1 ? '' : rest.slice(pathStart);
  const credentialEnd = authority.lastIndexOf('@');

  if (credentialEnd === -1) {
    return uri;
  }

  const credentials = authority.slice(0, credentialEnd);
  const hosts = authority.slice(credentialEnd + 1);
  const passwordStart = credentials.indexOf(':');

  if (passwordStart === -1) {
    return uri;
  }

  const username = credentials.slice(0, passwordStart);
  const password = credentials.slice(passwordStart + 1);
  const encodedUsername = encodeURIComponent(decodeURIComponent(username));
  const encodedPassword = encodeURIComponent(decodeURIComponent(password));

  return `${protocol}${encodedUsername}:${encodedPassword}@${hosts}${suffix}`;
};

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  mongoUri: encodeMongoCredentials(process.env.MONGO_URI),
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
};
