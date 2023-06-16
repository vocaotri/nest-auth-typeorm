import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { LangDto } from "src/utils/dto/lang.dto";

export class RefreshDto extends LangDto {
    @ApiProperty({
        example: 'xxxxxxxxxx',
        description: 'Refresh token',
    })
    @IsNotEmpty()
    refreshToken: string;
}