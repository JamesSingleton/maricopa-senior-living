import type { LucideIcon } from "lucide-react";
import { File } from "lucide-react";
import type { StructureBuilder } from "sanity/structure";

import type { SchemaType, SingletonType } from "../schemaTypes";
import { getTitleCase } from "../utils/helper";

type Base<T = SchemaType> = {
  id?: string;
  type: T;
  title?: string;
  icon?: LucideIcon;
};

type CreateSingleton = { S: StructureBuilder } & Base<SingletonType>;
type CreateList = { S: StructureBuilder } & Base;

export const createSingleton = ({ S, type, title, icon }: CreateSingleton) => {
  const newTitle = title ?? getTitleCase(type);
  return S.listItem()
    .title(newTitle)
    .icon(icon ?? File)
    .child(S.document().schemaType(type).documentId(type));
};

export const createList = ({ S, type, icon, title, id }: CreateList) => {
  const newTitle = title ?? getTitleCase(type);
  return S.documentTypeListItem(type)
    .id(id ?? type)
    .title(newTitle)
    .icon(icon ?? File);
};

export const SINGLETON_TYPES: SingletonType[] = [
  "home",
  "blogIndex",
  "settings",
  "navbar",
  "footer",
];
