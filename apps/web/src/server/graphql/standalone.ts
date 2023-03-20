import { graphql } from "graphql";
import { schema } from "./schema";
import { db } from "@ms/clients";
import { ExecutionResult } from "graphql";
import { Maybe } from "graphql/jsutils/Maybe";

export default async function queryGraphql<
  T,
  A extends Maybe<{ readonly [variable: string]: unknown }>
>(
  query: string,
  variableValues: A = {} as A
): Promise<ExecutionResult<T>["data"]> {
  const res = (await graphql({
    schema,
    contextValue: {
      prisma: db,
    },
    source: query,
    variableValues,
  })) as ExecutionResult<T>;
  console.log(JSON.stringify(res.errors, null, 2));

  return res?.data;
}
