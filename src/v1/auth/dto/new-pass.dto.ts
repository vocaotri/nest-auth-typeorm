import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MinLength } from "class-validator";

export class NewPassDto {
    @ApiProperty({
        example: 'xxxxxxxxxx',
        description: 'New password',
    })
    @IsNotEmpty()
    @MinLength(6)
    newPassword: string;
}