import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { LangDto } from "src/utils/dto/lang.dto";

export class ResetPassDto extends LangDto {
    @ApiProperty({
        example: 'xxxxxxxxxx',
        description: 'Verify token',
    })
    @IsNotEmpty()
    resetPassToken: string;
}