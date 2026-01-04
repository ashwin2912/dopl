import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  anthropicApiKey: string;
  googleClientId: string;
  googleClientSecret: string;
  googleRedirectUri: string;
  googleRefreshToken: string;
  googleDocId: string;
  frontendUrl: string;
}

function getEnvVariable(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const config: Config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  anthropicApiKey: getEnvVariable('ANTHROPIC_API_KEY'),
  googleClientId: getEnvVariable('GOOGLE_CLIENT_ID'),
  googleClientSecret: getEnvVariable('GOOGLE_CLIENT_SECRET'),
  googleRedirectUri: getEnvVariable('GOOGLE_REDIRECT_URI', 'http://localhost:3001/auth/google/callback'),
  googleRefreshToken: getEnvVariable('GOOGLE_REFRESH_TOKEN'),
  googleDocId: getEnvVariable('GOOGLE_DOC_ID'),
  frontendUrl: getEnvVariable('FRONTEND_URL', 'http://localhost:3000'),
};

export default config;
