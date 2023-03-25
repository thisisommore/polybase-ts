import { Collection } from './Collection';
import { SubscriptionErrorFn, SubscriptionFn } from './Subscription';
import { Client } from './Client';
import { Request, CollectionRecordResponse, CallArgs } from './types';
export type CollectionRecordSnapshotRegister<T> = (d: CollectionRecord<T>, fn: SubscriptionFn<CollectionRecordResponse<T>>, errFn?: SubscriptionErrorFn) => (() => void);
export type CollectionRecordReference = {
    collectionId: string;
    id: string;
};
export declare class CollectionRecord<T> {
    id: string;
    private collection;
    private client;
    private onSnapshotRegister;
    constructor(id: string, collection: Collection<T>, client: Client, onSnapshotRegister: CollectionRecordSnapshotRegister<T>);
    call: (functionName: string, args?: CallArgs) => Promise<CollectionRecordResponse<T>>;
    get: () => Promise<CollectionRecordResponse<T>>;
    reference: () => CollectionRecordReference;
    key: () => string;
    onSnapshot: (fn: SubscriptionFn<CollectionRecordResponse<T>>, errFn?: SubscriptionErrorFn) => () => void;
    request: () => Request;
}
/**
 * @deprecated use CollectionRecord
 */
export declare const Doc: typeof CollectionRecord;
export declare function deserializeRecord(data: Record<string, any>, properties: {
    name: string;
    type: any;
    fields?: any;
}[]): void;
//# sourceMappingURL=Record.d.ts.map