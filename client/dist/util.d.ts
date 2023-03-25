import type { CallArg } from './types';
export declare function getCollectionAST(id: string, ast: any): any;
export declare function getCollectionProperties(id: string, ast: any): any;
export declare function getCollectionShortNameFromId(id: string): string | undefined;
export declare function encodeBase64(value: Uint8Array): string;
export declare function decodeBase64(value: string): Uint8Array;
export declare function referenceArg(arg: CallArg): CallArg;
export declare function serializeValue(arg: CallArg): CallArg;
//# sourceMappingURL=util.d.ts.map