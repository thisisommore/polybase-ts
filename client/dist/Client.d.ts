import { QueryValue, Request, RequestParams, Sender, SenderResponse, Signer, SignerResponse } from './types';
export interface ClientConfig {
    clientId: string;
    baseURL: string;
}
type SignatureCache = Record<string, {
    timeMs: number;
    sig: SignerResponse;
}>;
export declare class Client {
    private sender;
    signer?: Signer;
    private config?;
    private signatureCache;
    constructor(sender: Sender, signer?: Signer, config?: ClientConfig);
    request: (req: Request) => ClientRequest;
}
export declare class ClientRequest {
    private aborter;
    private req;
    private sender;
    private signer?;
    private config?;
    private signatureCache;
    constructor(sender: Sender, req: Request, signatureCache: SignatureCache, signer?: Signer, config?: ClientConfig);
    abort: () => void;
    send: (withAuth: 'none' | 'optional' | 'required', sigExtraTimeMs?: number) => Promise<SenderResponse>;
    private getSignature;
}
export declare function parseParams(params?: RequestParams): Record<string, QueryValue | undefined>;
export {};
//# sourceMappingURL=Client.d.ts.map