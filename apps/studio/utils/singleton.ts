import type { ComponentType } from "react";
import type { StructureBuilder } from "sanity/structure";

export const SINGLETONS = ["homePage", "settings", "navigation"] as const;

export type SingletonType = (typeof SINGLETONS)[number];

export function createSingleton(
  S: StructureBuilder,
  typeName: SingletonType,
  title: string,
  icon?: ComponentType,
) {
  return S.listItem()
    .title(title)
    .icon(icon)
    .child(S.document().schemaType(typeName).documentId(typeName).title(title));
}

export function isSingleton(typeName: string): typeName is SingletonType {
  return (SINGLETONS as readonly string[]).includes(typeName);
}
