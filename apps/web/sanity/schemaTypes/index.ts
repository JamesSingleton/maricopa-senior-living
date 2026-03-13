import { definitions } from "./definitions";
import { documents, singletons } from "./documents";

export const schemaTypes = [...documents, ...definitions];
export const schemaNames = [...documents].map((doc) => doc.name);
export type SchemaType = (typeof schemaNames)[number];

export const singletonType = singletons.map(({ name }) => name);
export type SingletonType = (typeof singletonType)[number];

export default schemaTypes;
