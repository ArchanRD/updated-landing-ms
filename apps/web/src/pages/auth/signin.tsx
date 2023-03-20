import { Button } from "@untitledui/core";
import { SvgIconProps } from "@untitledui/icons/outline";
import { GoogleIcon } from "@untitledui/icons/social";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import {
  signIn,
  getProviders,
  ClientSafeProvider,
  getSession,
} from "next-auth/react";
import React from "react";

const SocialLogos: Record<
  ClientSafeProvider["name"],
  (props: SvgIconProps) => JSX.Element
> = {
  google: GoogleIcon,
};

const Signin = ({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <div style={{ overflow: "hidden", position: "relative" }}>
      <div />
      <div>
        <div>
          <div>
            {/* <input name="csrfToken" type="hidden" defaultValue={csrfToken} /> */}
            <input placeholder="Email" />
            <button>Submit</button>
            <hr />
            <div className="space-y-2">
              {providers &&
                Object.values(providers).map((provider) => (
                  <Button
                    onClick={() =>
                      signIn(provider.id, {
                        callbackUrl: "http://localhost:3000/",
                      })
                    }
                    type="secondary-gray"
                    iconPosition="left"
                    key={provider.name}
                    Icon={SocialLogos[provider.id]}
                  >
                    Sign in with {provider.name}
                  </Button>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const providers = await getProviders();
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
      props: {
        providers,
      },
    };
  }
  return {
    props: {
      providers,
    },
  };
}
