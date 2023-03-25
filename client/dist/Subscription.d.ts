import { Client } from './Client';
import { PolybaseError } from './errors';
import { Request } from './types';
export type SubscriptionFn<T> = ((data: T) => void);
export type SubscriptionErrorFn = ((err: PolybaseError) => void);
export interface SubscriptionOptions {
    timeout: number;
    maxErrorTimeout: number;
}
export interface Listener<T> {
    fn: SubscriptionFn<T>;
    errFn?: SubscriptionErrorFn;
}
export declare class Subscription<T> {
    private _listeners;
    private req;
    private client;
    private since?;
    private aborter?;
    private _stopped;
    private options;
    private errors;
    private data?;
    private timer?;
    private id;
    private isPublicallyAccessible;
    constructor(req: Request, client: Client, isPublicallyAccessible: Promise<boolean>, options?: Partial<SubscriptionOptions>);
    tick: (id?: number) => Promise<void>;
    subscribe: (fn: SubscriptionFn<T>, errFn?: SubscriptionErrorFn) => () => void;
    start: () => void;
    stop: () => void;
    get listeners(): Listener<T>[];
    get stopped(): boolean;
}
//# sourceMappingURL=Subscription.d.ts.map