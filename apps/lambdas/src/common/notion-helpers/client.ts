import { Client, LogLevel } from "@notionhq/client";
import PQueue from "p-queue";
import pRetry from "p-retry";
import { HOURS_OF_DATA_TO_UPDATE_IN_MILI_SECOND } from "../utils/consts";

import getEnvVar from "../utils/get-env-var";

const NOTION_API_SECRET = getEnvVar("NOTION_API_SECRET", true);

export type NotionClient = Awaited<ReturnType<typeof initNotionClient>>;

let notionClient: NotionClient;

declare global {
  var __notionClient;
}
export type NotionPageProperties = Record<
  string,
  {
    id: string;
  }
>;

export const GetDataMadeOrUpdatedAfter = new Date(
  new Date().getTime() - HOURS_OF_DATA_TO_UPDATE_IN_MILI_SECOND
);

const queue = new PQueue({
  autoStart: true,
  interval: 1000,
  intervalCap: 3,
  carryoverConcurrencyCount: true,
});

export async function initNotionClient() {
  const notionClient = new Client({
    auth: NOTION_API_SECRET,
    timeoutMs: 120000,
    notionVersion: "2022-06-28",
    // logLevel: "debug" as LogLevel,
  });

  const createDatabase: typeof notionClient.databases.create = (args) => {
    return queue.add(() =>
      pRetry(() => notionClient.databases.create(args), {
        retries: 10,
        maxRetryTime: 10000,
      })
    );
  };

  const updateDatabase: typeof notionClient.databases.update = (args) => {
    return queue.add(() =>
      pRetry(() => notionClient.databases.update(args), {
        retries: 10,
        maxRetryTime: 10000,
      })
    );
  };

  const retrieveDatabase: typeof notionClient.databases.retrieve = (args) => {
    return queue.add(() =>
      pRetry(() => notionClient.databases.retrieve(args), {
        retries: 10,
        maxRetryTime: 10000,
      })
    );
  };
  const queryDatabase: typeof notionClient.databases.query = (args) => {
    return queue.add(() =>
      pRetry(() => notionClient.databases.query(args), {
        retries: 10,
        maxRetryTime: 10000,
      })
    );
  };
  const retrievePage: typeof notionClient.pages.retrieve = (args) => {
    return queue.add(() =>
      pRetry(() => notionClient.pages.retrieve(args), {
        retries: 10,
        maxRetryTime: 10000,
      })
    );
  };
  const retrievePageProperties: typeof notionClient.pages.properties.retrieve =
    (args) => {
      return queue.add(() =>
        pRetry(() => notionClient.pages.properties.retrieve(args), {
          retries: 10,
          maxRetryTime: 10000,
        })
      );
    };
  const retrieveBlockChildren: typeof notionClient.blocks.children.list = (
    args
  ) => {
    return queue.add(() =>
      pRetry(() => notionClient.blocks.children.list(args), {
        retries: 10,
        maxRetryTime: 10000,
      })
    );
  };

  return {
    retrieveDatabase,
    queryDatabase,
    retrievePage,
    retrievePageProperties,
    retrieveBlockChildren,
    createDatabase,
    updateDatabase,
  };
}

export async function getNotionClient() {
  if (process.env.NODE_ENV === "production") {
    notionClient = await initNotionClient();
  } else {
    if (!global.__notionClient) {
      global.__notionClient = initNotionClient();
    }
    notionClient = global.__notionClient;
  }
  return notionClient;
}
