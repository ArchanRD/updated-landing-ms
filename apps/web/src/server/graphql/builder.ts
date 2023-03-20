import SchemaBuilder from "@pothos/core";
import { PrismaClient } from "@ms/clients";
import PrismaPlugin from "@pothos/plugin-prisma";
import PrismaTypes from "@ms/clients/build/pothos-types";
import SimpleObjectsPlugin from "@pothos/plugin-simple-objects";
import { GraphQLContext } from "../../pages/api";
import ScopeAuthPlugin from "@pothos/plugin-scope-auth";

const prisma = new PrismaClient({});

export type Scalars = {
  DateTime: {
    Input: Date;
    Output: Date;
  };
};
// GraphQL context type

// Pothos GraphQL schema builder
const builder = new SchemaBuilder<{
  Context: GraphQLContext;
  PrismaTypes: PrismaTypes;
  Scalars: Scalars;
  AuthScopes: {
    user: boolean;
  };
}>({
  plugins: [ScopeAuthPlugin, SimpleObjectsPlugin, PrismaPlugin],
  prisma: {
    client: prisma,
  },
  authScopes: async (context) => ({
    user: !!context.user,
  }),
});

builder.scalarType("DateTime", {
  serialize: (value) => value.toISOString(),
  parseValue: (value) => {
    const date = new Date(value as string);

    if (Number.isNaN(date.valueOf())) {
      throw new Error("Invalid ISO date");
    }

    return date;
  },
});

export default builder;
