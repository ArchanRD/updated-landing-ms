import fetch from "node-fetch";
import {
  NOTION_SEEDER_DEV_SLACK_WEBHOOK_URL,
  NOTION_SEEDER_SLACK_WEBHOOK_URL,
} from "../utils/consts";

export default async function sendSlackMessage(
  messageBody: any,
  isUnknownError = false
) {
  return fetch(
    isUnknownError
      ? NOTION_SEEDER_DEV_SLACK_WEBHOOK_URL
      : NOTION_SEEDER_SLACK_WEBHOOK_URL,
    {
      method: "Post",
      body: JSON.stringify(messageBody),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
