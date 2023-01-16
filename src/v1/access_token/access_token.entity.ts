import { ApiProperty } from "@nestjs/swagger";
import { AppBaseEntity } from "src/utils/entities/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/user.entity";

@Entity({
    name: 'access_tokens',
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
        description: 'expiration_date',
    })
    @Column()
    expiration_date: Date;

    @ApiProperty({
        example: 1,
        description: 'refresh_token',
    })
    @Column()
    refresh_token: string;

    @ApiProperty({
        example: 1,
        description: 'refresh_expiration_date',
    })
    @Column()
    refresh_expiration_date: Date;

    @ApiProperty({
        example: 1,
        description: 'revoked_at',
    })
    @Column()
    revoked_at: Date;

    @ApiProperty({
        example: 1,
        description: 'last_used_at',
    })
    @Column()
    last_used_at: Date;

    @ApiProperty({
        example: 1,
        description: 'user_id',
    })
    @ManyToOne(() => User, (user) => user.access_tokens)
    @JoinColumn({ name: 'user_id' })
    user: User;
}