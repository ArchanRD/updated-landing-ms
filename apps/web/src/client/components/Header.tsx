import { Fragment } from "react";
// TODO: remove headlessui from the APP
import { Popover, Transition } from "@headlessui/react";
import Logo from "./Logo";
import { Button } from "@untitledui/core";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { GoogleIcon } from "@untitledui/icons/social";

type Props = {};

const navigation = [
  { name: "Home", href: "https://missionsustainability.org/" },
  { name: "Blog", href: "https://missionsustainability.org/blog/" },
];

const Header = () => {
  const { data: session, status } = useSession();
  console.log({ session });

  return (
    <div className="relative">
      <div className="relative pt-6 pb-16">
        <Popover>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <nav
              className="relative flex items-center justify-between sm:h-10 md:justify-end"
              aria-label="Global"
            >
              <div className="flex items-center flex-1 md:absolute md:inset-y-0 md:left-0">
                <div className="flex items-center justify-between w-full md:w-auto">
                  <Link href="https://missionsustainability.org/">
                    <a>
                      <span className="sr-only">Mission Sustainability</span>
                      <Logo className="h-8 w-auto sm:h-10" />
                    </a>
                  </Link>
                  <div className="-mr-2 flex items-center md:hidden">
                    <Popover.Button className="bg-gray-50 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                      <span className="sr-only">Open main menu</span>
                      {/* <Menu01Icon className="h-6 w-6" aria-hidden="true" /> */}
                    </Popover.Button>
                  </div>
                </div>
              </div>
              <div className="hidden md:flex md:space-x-10 md:items-center">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="font-medium text-gray-500 hover:text-gray-900"
                  >
                    {item.name}
                  </a>
                ))}
                {status === "unauthenticated" && (
                  <span className="inline-flex rounded-md shadow">
                    <Button
                      type="secondary-color"
                      onClick={() =>
                        signIn("google", {
                          callbackUrl: "http://localhost:3000/",
                        })
                      }
                      Icon={GoogleIcon}
                    >
                      Sign in
                    </Button>
                  </span>
                )}
                {status === "authenticated" && (
                  <Button type="secondary-gray" onClick={() => signOut()}>
                    Sign out
                  </Button>
                )}
              </div>
            </nav>
          </div>

          <Transition
            as={Fragment}
            enter="duration-150 ease-out"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="duration-100 ease-in"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Popover.Panel
              focus
              className="absolute z-10 top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden"
            >
              <div className="rounded-lg shadow-md bg-white ring-1 ring-black ring-opacity-5 overflow-hidden">
                <div className="px-5 pt-4 flex items-center justify-between">
                  <div>
                    <Logo className="h-8 w-auto" />
                  </div>
                  <div className="-mr-2">
                    <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                      <span className="sr-only">Close menu</span>
                      {/* <XIcon className="h-6 w-6" aria-hidden="true" /> */}
                    </Popover.Button>
                  </div>
                </div>
                <div className="px-2 pt-2 pb-3">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                {status === "unauthenticated" && (
                  <Button
                    type="secondary-color"
                    onClick={() =>
                      signIn("google", {
                        callbackUrl: "http://localhost:3000/",
                      })
                    }
                    Icon={GoogleIcon}
                  >
                    Sign in
                  </Button>
                )}
                {status === "authenticated" && (
                  <Button type="secondary-gray" onClick={() => signOut()}>
                    Sign out
                  </Button>
                )}
              </div>
            </Popover.Panel>
          </Transition>
        </Popover>
      </div>
    </div>
  );
};

export default Header;
