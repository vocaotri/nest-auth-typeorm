import { AfterLoad, BeforeInsert, BeforeSoftRemove, BeforeUpdate, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Exclude } from 'class-transformer';
// import { UserVerify } from './user_verify.entity';
import { hashPassword } from 'src/utils/utils';
// import { Pet } from './pet.entity';
import { PolymorphicChildren } from 'typeorm-polymorphic';
// import { Follow } from './follow.entity';
import { AppBaseEntity } from 'src/utils/entities/base.entity';
import { UserRole } from './enums/UserRole';
import { AccessToken } from '../access_token/access_token.entity';
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

@Entity({
    name: 'users',
})
// Create pair of unique columns for soft delete
@Unique(['user_name', 'not_delete'])
@Unique(['email', 'not_delete'])
@Unique(['phone', 'not_delete'])
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
    user_name: string;

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

    @OneToMany(() => AccessToken, (_) => _.user)
    access_tokens: AccessToken[];

    // @OneToMany(() => UserVerify, (_) => _.user_verify)
    // user_verifies: UserVerify[];

    @Column({ select: false, default: 1, nullable: true })
    not_delete: boolean;

    @BeforeSoftRemove()
    async setNotDeleted() {
        this.not_delete = null;
        await this.save();
    }

    private tempPassword: string;

    @AfterLoad()
    loadTempPassword(): void {
        this.tempPassword = this.password;
    }

    @BeforeInsert()
    @BeforeUpdate()
    async setHashPassword() {
        if (this.password && this.password !== this.tempPassword) {
            this.password = await hashPassword(this.password);
        }
    }

    // @ManyToMany(() => Pet, (_) => _.users)
    // @JoinTable({ name: 'user_pets' , joinColumn: { name: 'user_id' }, inverseJoinColumn: { name: 'pet_id' }})
    // pets: Pet[]

    // @PolymorphicChildren(() => Follow, {
    //     eager: false,
    // })
    // follows: Follow[];
}