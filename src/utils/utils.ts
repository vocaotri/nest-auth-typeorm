import * as bcrypt from 'bcrypt';
import {
    createCipheriv,
    createDecipheriv,
    randomBytes,
    webcrypto,
} from 'crypto';

var key = process.env.ENCRYPTION_KEY || 'q2V7Ad2d7k6cZ3RXjLdE8IwP5ostGxaH'; // 32 bytes
var ivHex = process.env.IV_KEY || '97dda8f12eb735505e3b9d76b416b2d2'; // 32 bytes => 16 ** need to randomBytes(16)
var iv = Buffer.from(ivHex, 'hex');

export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 11);
};

export const addMinutes = (minutes, date = new Date()) => {
    let newDate = new Date();
    if (date) {
        newDate = new Date(date.getTime());
    }
    newDate.setMinutes(date.getMinutes() + minutes);
    return date;
};

export const addDays = (days, date = null) => {
    let newDate = new Date();
    if (date) {
        newDate = new Date(date.getTime());
    }
    newDate.setDate(newDate.getDate() + days);
    return newDate;
};

export const encryptData = (textToEncrypt: string): string => {
    const cipher = createCipheriv('aes-256-ctr', key, iv);
    const encryptedText = Buffer.concat([
        cipher.update(textToEncrypt),
        cipher.final(),
    ]);
    return encryptedText.toString('hex');
};

export const decryptData = (encryptedText: string): string => {
    // convert encryptedText to buffer
    const encryptedBuffer = Buffer.from(encryptedText, 'hex');
    const decipher = createDecipheriv('aes-256-ctr', key, iv);
    const decryptedText = Buffer.concat([
        decipher.update(encryptedBuffer),
        decipher.final(),
    ]);
    return decryptedText.toString();
};


export const randRange = (min: number, max: number) => {
    let range = max - min;
    let requestBytes = Math.ceil(Math.log2(range) / 8);
    if (min > max) {
        return min;
    }
    if (!requestBytes) {
        // No randomness required
        return min;
    }
    let maxNum = Math.pow(256, requestBytes);
    let ar = new Uint8Array(requestBytes);
    const crypto = webcrypto as unknown as Crypto;
    while (true) {
        crypto.getRandomValues(ar);
        let val = 0;
        for (let i = 0; i < requestBytes; i++) {
            val = (val << 8) + ar[i];
        }
        if (val < maxNum - (maxNum % range)) {
            return min + (val % range);
        }
    }
};

export const addValueToString = (str: string, values: object) => {
    for (const key in values) {
        str = str.replace(new RegExp(`:${key} |:${key}$`, 'g'), values[key] + ' ');
    }
    return str;
};
