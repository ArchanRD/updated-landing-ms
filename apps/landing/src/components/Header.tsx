import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Menu01Icon, XCloseIcon } from "@untitledui/icons/duotone";
import Logo from "./Logo";

const navigation = [
  { name: "Eco-repository", href: "#" },
  { name: "Community", href: "#" },
  { name: "Blog", href: "#" },
  { name: "About us", href: "#" },
];

export default function Example() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-[#FFFCF9] w-full absolute">
      <nav
        className="mx-auto flex items-center justify-between p-6 lg:px-16"
        aria-label="Global"
      >
        <div className="flex items-center gap-x-12">
          <div className="inline-flex items-center space-x-2">
            <a
              href="https://missionsustainability.org"
              className="-m-1.5 p-1.5"
            >
              <span className="sr-only">Enviable</span>
              <Logo className="h-8 w-auto"></Logo>
            </a>
            <h3 className="font-bold text-gray-700 mx-0 text-lg">Enviable</h3>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Menu01Icon
              className="h-6 w-6"
              aria-hidden="true"
              fill={"#1F2937"}
            />
          </button>
        </div>
        <div className="hidden lg:flex lg:space-x-4">
          {/* <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
            Log in <span aria-hidden="true">&rarr;</span>
          </a> */}
          <button className="border-[1px] h-10 border-gray-800 rounded font-inter text-base font-medium px-5 py-2">
            Login
          </button>
          <button className="bg-gray-800 h-10 text-white px-5 py-2 rounded font-inter text-base font-medium">
            Sign up
          </button>
        </div>
      </nav>
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Enviable</span>
                <Logo className="h-8 w-auto" />
              </a>
              <h3 className="font-bold">Enviable</h3>
            </div>

            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XCloseIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              <div className="py-6">
                <a
                  href="#"
                  className="-mx-3 block rounded-lg py-2.5 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Log in
                </a>
                <a
                  href="#"
                  className="-mx-3 block rounded-lg py-2.5 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Sign up
                </a>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}
