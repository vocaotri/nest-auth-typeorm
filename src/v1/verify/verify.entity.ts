import { ApiProperty } from "@nestjs/swagger";
import { AppBaseEntity } from "src/utils/entities/base.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/user.entity";

// enum
export enum VerifyTokenType {
    EMAIL = 'email',
    PHONE = 'phone',
    FORGET_PASSWORD = 'forget_password',
}

@Entity({
    name: 'verifies',
})
export class Verify extends AppBaseEntity {
    @ApiProperty({
        example: 1,
        description: 'Id of Verify',
    })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({
        example: 1,
        description: 'token',
    })
    @Column()
    token: string;

    @ApiProperty({
        example: 1,
        description: 'token type',
    })
    @Column({
        type: "enum",
        enum: VerifyTokenType,
        default: VerifyTokenType.EMAIL
    })
    tokenType: VerifyTokenType;

    @ApiProperty({
        example: 1,
        description: 'expirationDate',
    })
    @Column()
    expirationDate: Date;

    @ApiProperty({
        example: 1,
        description: 'usedAt',
    })
    @Column({
        nullable: true,
    })
    usedAt: Date;

    @ManyToOne(() => User, (_) => _.verifies)
    user: User;
    @Column()
    userId: number;
}