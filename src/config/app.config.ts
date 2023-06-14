import { registerAs } from "@nestjs/config";

export default registerAs('app', () => ({
    APP_DEBUG: process.env.APP_DEBUG,
    APP_URL: process.env.APP_URL,
}));