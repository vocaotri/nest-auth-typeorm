import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class VerifyDto {
    @ApiProperty({
        example: 'xxxxxxxxxx',
        description: 'Verify token',
    })
    @IsNotEmpty()
    verifyToken: string;
}