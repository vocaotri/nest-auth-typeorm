import { AfterLoad, BeforeInsert, BeforeSoftRemove, BeforeUpdate, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Exclude } from 'class-transformer';
import { hashPassword } from 'src/utils/utils';
// import { Pet } from './pet.entity';
import { PolymorphicChildren } from 'typeorm-polymorphic';
// import { Follow } from './follow.entity';
import { AppBaseEntity } from 'src/utils/entities/base.entity';
import { UserRole } from './enums/UserRole';
import { AccessToken } from '../access-token/access-token.entity';
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { Verify } from '../verify/verify.entity';
import { compare } from 'bcrypt';

// enum
export enum UserStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    BLOCKED = 'BLOCKED',
}
@Entity({
    name: 'users',
})
// Create pair of unique columns for soft delete
@Unique(['username', 'notDelete'])
@Unique(['email', 'notDelete'])
@Unique(['phone', 'notDelete'])
export class User extends AppBaseEntity {
    @ApiProperty({
        example: 1,
        description: 'Id of User',
    })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({
        example: 'trisma',
        description: 'username',
    })
    @Column()
    username: string;

    @ApiProperty({
        example: 'example@example.com',
        description: 'Email only for login normal login',
    })
    @Column()
    email: string;

    @ApiProperty({
        example: '0123456789',
        description: 'Phone only for login normal login',
    })
    @Column()
    phone: string;

    @Column()
    @Exclude()
    password: string;

    @ApiProperty({
        example: UserRole.USER,
        description: 'Role of User',
    })
    @Column({ type: "enum", enum: UserRole, default: UserRole.USER })
    role: UserRole;

    @ApiProperty({
        example: UserStatus.ACTIVE,
        description: 'Status of User',
    })
    @Column({ type: "enum", enum: UserStatus, default: UserStatus.INACTIVE })
    status: UserStatus;

    @OneToMany(() => AccessToken, (_) => _.user)
    accessTokens: AccessToken[];

    @Exclude()
    currentAccessTokenId?: number;

    @OneToMany(() => Verify, (_) => _.user)
    verifies: Verify[];

    @Column({ select: false, default: 1, nullable: true })
    @Exclude()
    notDelete: boolean;

    @BeforeSoftRemove()
    async setNotDeleted() {
        this.notDelete = null;
        await this.save();
    }

    @BeforeInsert()
    @BeforeUpdate()
    async updateHashPassword() {
        if (this.password ) {
            this.password = await hashPassword(this.password);
        }
    }

    // @ManyToMany(() => Pet, (_) => _.users)
    // @JoinTable({ name: 'user_pets' , joinColumn: { name: 'userId' }, inverseJoinColumn: { name: 'pet_id' }})
    // pets: Pet[]

    // @PolymorphicChildren(() => Follow, {
    //     eager: false,
    // })
    // follows: Follow[];
}