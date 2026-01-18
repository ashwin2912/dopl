import dotenv from "dotenv";

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  anthropicApiKey: string;
  googleClientId: string;
  googleClientSecret: string;
  googleRedirectUri: string;
  googleRefreshToken: string;
  googleServiceAccountEmail?: string;
  googleServiceAccountKey?: string;
  googleDocId: string;
  googleBlogFolderId: string;
  recaptchaSecretKey: string;
  frontendUrl: string;
}

function getEnvVariable(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function getOptionalEnvVariable(key: string): string | undefined {
  return process.env[key];
}

export const config: Config = {
  port: parseInt(process.env.PORT || "3001", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  anthropicApiKey: getEnvVariable("ANTHROPIC_API_KEY"),
  googleClientId: getEnvVariable("GOOGLE_CLIENT_ID"),
  googleClientSecret: getEnvVariable("GOOGLE_CLIENT_SECRET"),
  googleRedirectUri: getEnvVariable(
    "GOOGLE_REDIRECT_URI",
    "http://localhost:3001/auth/google/callback",
  ),
  googleRefreshToken: getEnvVariable("GOOGLE_REFRESH_TOKEN"),
  googleServiceAccountEmail: getOptionalEnvVariable(
    "GOOGLE_SERVICE_ACCOUNT_EMAIL",
  ),
  googleServiceAccountKey: getOptionalEnvVariable("GOOGLE_SERVICE_ACCOUNT_KEY"),
  googleDocId: getEnvVariable("GOOGLE_DOC_ID"),
  googleBlogFolderId: getEnvVariable("GOOGLE_BLOG_FOLDER_ID"),
  recaptchaSecretKey: getEnvVariable("RECAPTCHA_SECRET_KEY"),
  frontendUrl: getEnvVariable("FRONTEND_URL", "http://localhost:3000"),
};

export default config;
