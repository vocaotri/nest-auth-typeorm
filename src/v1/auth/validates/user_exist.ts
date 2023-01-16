import { Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { UserService } from '../../user/user.service';


@ValidatorConstraint({ name: "UserExists", async: true })
@Injectable()
export class ExistValidator implements ValidatorConstraintInterface {
    constructor(private userService: UserService) {}
    async validate(value: any, args: ValidationArguments): Promise<boolean> {
        const filter = {};
        filter[args.property] = value;
        const countUser = this.userService.countUser(filter);
        return countUser > 0;
    }
    defaultMessage(args: ValidationArguments) {
        return `${args.property} is not exist`;
    }
}