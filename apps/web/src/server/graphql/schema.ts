import builder from "./builder";
import * as types from "./types/index";

builder.queryType({});
builder.mutationType({});

Object.values(types).forEach((type) => {
  console.log("type", type);
  if (typeof type === "function") {
    type();
  }
});

// Build and export the schema
export const schema = builder.toSchema({});
