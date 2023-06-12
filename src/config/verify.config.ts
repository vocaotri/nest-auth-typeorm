import { registerAs } from "@nestjs/config";

export default registerAs('verify', () => ({
    TOKEN_EXPIRATION_TIME: process.env.TOKEN_EXPIRATION_TIME,
    ISOLATE_LOGIN: process.env.ISOLATE_LOGIN
}));