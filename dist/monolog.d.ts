import { MonologLogObject } from './interface';
export declare class Monolog {
    static createClient(): Monolog;
    log(message: MonologLogObject): void;
}
