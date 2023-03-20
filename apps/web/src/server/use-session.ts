import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession, User } from "next-auth";
import { Middleware } from "next-connect";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import { ERROR_CODES } from "../utils/constant";
import { Request } from "./api-route";

export interface NextProtectedAPIRequest extends NextApiRequest {
  user?: User;
}

export type NextProtectedApiHandler<T = any> = (
  req: NextProtectedAPIRequest,
  res: NextApiResponse<T & { error?: { code: ERROR_CODES; message: string } }>
) => void | Promise<void>;

const injectUser: Middleware<Request, NextApiResponse> = async (
  req,
  res,
  next
) => {
  console.log("calling get session");
  // Get token and check if it exists
  let session = await unstable_getServerSession(req, res, authOptions);

  if (session) {
    console.log("session", JSON.stringify(session, null, 2));
    // Grant access to protected route
    req.user = session?.user as User;
  }
  next();
};

export default injectUser;
