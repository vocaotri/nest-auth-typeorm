import { Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { UserService } from '../../user/user.service';


@ValidatorConstraint({ name: "UserNotExists", async: true })
@Injectable()
export class NotExistValidator implements ValidatorConstraintInterface {
    constructor(private userService: UserService) { }
    async validate(value: any, args: ValidationArguments): Promise<boolean> {
        const filter = {};
        filter[args.property] = value;
        const countUser = await this.userService.countUser(filter);
        return countUser > 0;
    }
    defaultMessage(args: ValidationArguments) {
        return `${args.property.charAt(0).toUpperCase() + args.property.slice(1)} is not exist`;
    }
}