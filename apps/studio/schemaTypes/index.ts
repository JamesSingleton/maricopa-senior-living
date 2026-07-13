import { SINGLETONS } from "../utils/singleton";
import { blocks } from "./blocks";
import { documents, singletons } from "./documents";
import { objects } from "./objects";
import { pageBuilder } from "./shared/page-builder";

export const schemaTypes = [...documents, ...objects, ...blocks, pageBuilder];

export const schemaNames = documents.map((doc) => doc.name);
export type SchemaType = (typeof schemaNames)[number];

export const singletonType = singletons.map(({ name }) => name);
export type SingletonType = (typeof singletonType)[number];

export { SINGLETONS };

export default schemaTypes;
