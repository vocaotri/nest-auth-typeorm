import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class RefreshDto {
    @ApiProperty({
        example: 'xxxxxxxxxx',
        description: 'Refresh token',
    })
    @IsNotEmpty()
    refreshToken: string;
}