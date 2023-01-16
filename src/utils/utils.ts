import { HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SALTORROUNDS } from 'src/contants/crypto';
import { ResponseDetailInterface, ResponseFailedInterface } from './interface/response.interface';

export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, SALTORROUNDS);
}

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
}

export const addMinutes = (minutes, date = new Date()) => {
    date.setMinutes(date.getMinutes() + minutes);
    return date;
}

export function ResponseSuccess(data: Object, message = "success"): ResponseDetailInterface {
    return {
        status: true,
        message: message,
        data: data
    };
}

export function ResponseFailed(errorMsg: string, data: any): ResponseFailedInterface {
    return {
        status: false,
        message: errorMsg,
        data: data
    };
}

export function ResponseDuplicateException(message): HttpException {
    throw new HttpException({ message }, HttpStatus.BAD_REQUEST);
}