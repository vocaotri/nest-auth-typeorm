import { Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { UserService } from '../../user/user.service';
import { REQUEST_CONTEXT } from 'src/utils/interceptors/inject-user.interceptor';
import { User } from '../user.entity';
import { ExtendedValidationArguments } from 'src/utils/interface/extended-validate-arg.interface';


@ValidatorConstraint({ name: "UserLoginExists", async: true })
@Injectable()
export class UserLoginExistValidator implements ValidatorConstraintInterface {
    constructor(private userService: UserService) { }
    async validate(value: any, args: ExtendedValidationArguments): Promise<boolean> {
        const user: User = args?.object[REQUEST_CONTEXT]?.user;
        const filter = {};
        filter[args.property] = value;
        const countUser = await this.userService.countUserOwn(filter, user);
        return countUser == 0;
    }
    defaultMessage(args: ValidationArguments) {
        return `${args.property} is exist`;
    }
}