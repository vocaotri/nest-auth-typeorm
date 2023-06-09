import { ApiProperty } from "@nestjs/swagger";
import { AppBaseEntity } from "src/utils/entities/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/user.entity";

@Entity({
    name: 'accessTokens',
})
export class AccessToken extends AppBaseEntity {
    @ApiProperty({
        example: 1,
        description: 'Id of AccessToken',
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
        description: 'expirationDate',
    })
    @Column()
    expirationDate: Date;

    @ApiProperty({
        example: 1,
        description: 'refreshToken',
    })
    @Column()
    refreshToken: string;

    @ApiProperty({
        example: 1,
        description: 'refreshExpirationDate',
    })
    @Column()
    refreshExpirationDate: Date;

    @ApiProperty({
        example: 1,
        description: 'revokedAt',
    })
    @Column()
    revokedAt: Date;

    @ApiProperty({
        example: 1,
        description: 'lastUsedAt',
    })
    @Column()
    lastUsedAt: Date;

    @ApiProperty({
        example: 1,
        description: 'userId',
    })
    @ManyToOne(() => User, (user) => user.accessTokens)
    user: User;
}