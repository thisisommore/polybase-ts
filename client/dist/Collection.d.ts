import { CollectionRecord } from './Record';
import { Query } from './Query';
import { SubscriptionFn, SubscriptionErrorFn } from './Subscription';
import { Client } from './Client';
import { QueryValue, CollectionMeta, CollectionRecordResponse, CollectionList, QueryWhereOperator, CallArgs } from './types';
export declare class Collection<T> {
    id: string;
    private querySubs;
    private recordSubs;
    private meta?;
    private validator?;
    private client;
    private astCache?;
    constructor(id: string, client: Client);
    load: () => Promise<void>;
    getMeta: () => Promise<CollectionMeta>;
    private name;
    private getCollectionAST;
    private getValidator;
    validate: (data: Partial<T>) => Promise<boolean>;
    isReadPubliclyAccessible: () => Promise<boolean>;
    isCallPubliclyAccessible: (methodName: string) => Promise<boolean>;
    private isCollectionPubliclyAccessible;
    create: (args: CallArgs) => Promise<CollectionRecordResponse<T>>;
    get: () => Promise<CollectionList<T>>;
    record: (id: string) => CollectionRecord<T>;
    /**
     * @deprecated use .record(id: string)
     */
    doc: (id: string) => CollectionRecord<T>;
    where: (field: string, op: QueryWhereOperator, value: QueryValue) => Query<T>;
    sort: (field: string, direction?: 'asc' | 'desc') => Query<T>;
    limit: (limit: number) => Query<T>;
    onSnapshot: (fn: SubscriptionFn<CollectionList<T>>, errFn?: SubscriptionErrorFn) => () => void;
    after: (cursor: string) => Query<T>;
    before: (cursor: string) => Query<T>;
    key: () => string;
    private createQuery;
    private onQuerySnapshotRegister;
    private onCollectionRecordSnapshotRegister;
}
//# sourceMappingURL=Collection.d.ts.map