import { Client } from './Client';
import { Collection } from './Collection';
import { SubscriptionFn, SubscriptionErrorFn } from './Subscription';
import { Request, QueryValue, QueryWhereOperator, QueryWhereKey, CollectionList } from './types';
export type QuerySnapshotRegister<T> = (q: Query<T>, fn: SubscriptionFn<CollectionList<T>>, errFn?: SubscriptionErrorFn) => (() => void);
export declare const QueryWhereOperatorMap: Record<QueryWhereOperator, QueryWhereKey>;
export declare class Query<T> {
    collection: Collection<T>;
    private params;
    private client;
    private onSnapshotRegister;
    constructor(collection: Collection<T>, client: Client, onSnapshotRegister: QuerySnapshotRegister<T>);
    sort: (field: string, direction?: 'asc' | 'desc') => Query<T>;
    limit: (limit: number) => Query<T>;
    after: (after: string) => this;
    before: (before: string) => this;
    where: (field: string, op: QueryWhereOperator, value: QueryValue) => Query<T>;
    get: () => Promise<CollectionList<T>>;
    validate: () => void;
    key: () => string;
    onSnapshot: (fn: SubscriptionFn<CollectionList<T>>, errFn?: SubscriptionErrorFn) => () => void;
    request: () => Request;
    clone: () => Query<T>;
}
//# sourceMappingURL=Query.d.ts.map