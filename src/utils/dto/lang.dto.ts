import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";

//enum
export enum Lang {
    EN = 'en',
    KR = 'kr',
}

export class LangDto {
    @ApiProperty({
        description: 'Language',
        enum: Lang,
        required: false,
    })
    @IsOptional()
    @IsEnum(Lang)
    lang: Lang;
}