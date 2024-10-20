import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface ShoppingItem {
  'id' : bigint,
  'text' : string,
  'completed' : boolean,
  'itemType' : string,
}
export interface _SERVICE {
  'addItem' : ActorMethod<[string, string], bigint>,
  'deleteItem' : ActorMethod<[bigint], boolean>,
  'getItemTypeStats' : ActorMethod<[], Array<[string, bigint]>>,
  'getItems' : ActorMethod<[], Array<ShoppingItem>>,
  'toggleCompleted' : ActorMethod<[bigint], boolean>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
