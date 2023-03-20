import { Prisma } from "@ms/clients";
import Joi from "joi";

export enum ERROR_CODES {
  // Auth related
  NOT_AUTHENTICATED = "NOT_AUTHENTICATED",
  ACTION_NOT_ALLOWED = "ACTION_NOT_ALLOWED",
  // Food entries
  MEAL_LIMIT_REACHED = "MEAL_LIMIT_REACHED",
  // General
  BAD_INPUT = "BAD_INPUT",
  USER_EXISTS = "USER_EXISTS",
  HTTP_METHOD_NOT_IMPLEMENTED = "HTTP_METHOD_NOT_IMPLEMENTED",
  SERVER_FAULT = "SERVER_FAULT",
  DATABASE_ERROR = "DATABASE_ERROR",
  // Admin
  USER_DOES_NOT_EXIST = "USER_DOES_NOT_EXIST",
  USER_DELETED = "USER_DELETED",
  USER_BLOCKED = "USER_BLOCKED",
  // Post
  POST_NOT_FOUND = "POST_NOT_FOUND",
}

export const ERROR_MESSAGES: Record<`${ERROR_CODES}`, string> = {
  HTTP_METHOD_NOT_IMPLEMENTED:
    "Please check the API request, method is not implemented!",
  ACTION_NOT_ALLOWED: "You are not allowed to perform this action!",
  MEAL_LIMIT_REACHED: "You have reached limit to add food items to this meal!",
  NOT_AUTHENTICATED: "You are not authenticated, Please log in again!",
  USER_DOES_NOT_EXIST: "USER_DOES_NOT_EXIST",
  BAD_INPUT: "The input is not valid, Please check again!",
  USER_EXISTS: "A user with that data already exists!",
  SERVER_FAULT: "Something went wrong!",
  DATABASE_ERROR: "Something went wrong! DATABASE_ERROR",
  USER_DELETED: "Account has been deleted, Please contact admin!",
  USER_BLOCKED: "Account has been blocked, Please contact admin!",
  POST_NOT_FOUND: "The post you are looking for is no longer available!",
};
export function generateJoiErrorMessageBody(
  url: string,
  name: string,
  error: Joi.ValidationError
) {
  const messageBody = {
    username: "Notion Seeder",
    text: "Issue Processing Resource <@U03QT6KK137>", // <> are used for linking
    icon_emoji: ":bomb:",
    attachments: [
      // attachments, here we also use long attachment to use more space
      {
        color: "#2eb886",
        fields: [
          {
            title: "Resource Name",
            value: name || "-",
            short: true,
          },
          ...error.details.map((err) => {
            return {
              title: err.context?.key,
              value: err.message,
              short: true,
            };
          }),
        ],
        actions: [
          // Slack supports many kind of different types, we'll use buttons here
          {
            type: "button",
            text: "Show Resource", // text on the button
            url, // url the button will take the user if clicked
          },
        ],
      },
    ],
  };
  return messageBody;
}

export function generatePrismaErrorMessageBody(
  url: string,
  name: string,
  error: Error
) {
  let err;
  let isUnknownError = false;
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      err = {
        code: ERROR_CODES.DATABASE_ERROR,
        prismaErrorCode: error.code,
        message: "Duplicate entry",
        meta: error.meta,
      };
    } else if (error.code === "P2000") {
      err = {
        code: ERROR_CODES.DATABASE_ERROR,
        prismaErrorCode: error.code,
        message: "Value too long",
        meta: error.meta,
      };
    } else if (error.code === "P2003") {
      err = {
        code: ERROR_CODES.DATABASE_ERROR,
        prismaErrorCode: error.code,
        message: "Foreign key constraint failed",
        meta: error.meta,
      };
    } else if (error.code === "P2004") {
      err = {
        code: ERROR_CODES.DATABASE_ERROR,
        prismaErrorCode: error.code,
        message: "A constraint failed on the database",
        meta: error.meta,
      };
    } else {
      isUnknownError = true;
      err = {
        code: ERROR_CODES.DATABASE_ERROR,
        prismaErrorCode: error.code,
        message: error.message,
        meta: error.meta,
      };
    }
  } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    isUnknownError = true;
    err = {
      code: ERROR_CODES.DATABASE_ERROR,
      prismaError: error,
      message: ERROR_MESSAGES.DATABASE_ERROR,
    };
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    // default to 500 server error
    // TODO - SEND EMAIL TO DEV Team
    isUnknownError = true;
    err = {
      code: ERROR_CODES.DATABASE_ERROR,
      prismaError: error,
      message: ERROR_MESSAGES.DATABASE_ERROR,
    };
  } else if (error instanceof Prisma.PrismaClientRustPanicError) {
    isUnknownError = true;
    // TODO - SEND EMAIL TO DEVOPS Team
    err = {
      code: ERROR_CODES.DATABASE_ERROR,
      message: "Something is wrong! Please contact admin",
    };
  } else {
    isUnknownError = true;
    err = {
      message: error.message,
    };
  }
  return {
    isUnknownError,
    messageBody: {
      username: "Notion Seeder",
      text: "Issue Processing Resource <@U03QT6KK137>", // <> are used for linking
      icon_emoji: ":bomb:",
      attachments: [
        // attachments, here we also use long attachment to use more space
        {
          color: "#2eb886",
          fields: [
            {
              title: "Resource Name",
              value: name || "-",
              short: true,
            },
            ...Object.entries(err).map(([key, value]) => {
              return {
                title: key,
                value: value || "-",
                short: true,
              };
            }),
          ],
          actions: [
            // Slack supports many kind of different types, we'll use buttons here
            {
              type: "button",
              text: "Show Resource", // text on the button
              url, // url the button will take the user if clicked
            },
          ],
        },
      ],
    },
  };
}
