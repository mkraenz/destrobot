import { Field } from "../components/entities/Field";
import { House1 } from "../components/entities/House1";
import { House2 } from "../components/entities/House2";
import { Windmill } from "../components/entities/Windmill";

export type Entity = House1 | House2 | Field | Windmill;
export type EntityClass =
    | typeof House1
    | typeof House2
    | typeof Field
    | typeof Windmill;

export type House = House1 | House2;
