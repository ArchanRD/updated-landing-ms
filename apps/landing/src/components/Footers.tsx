import Link from "next/link";
import React from "react";
import Logo from "./Logo";
import {
  InstagramMonotoneIcon,
  LinkedInMonotoneIcon,
  TwitterMonotoneIcon,
  YouTubeMonotoneIcon,
} from "@untitledui/icons/social";

type Props = {};

const Footer = (props: Props) => {
  return (
    <div className="flex w-full flex-col items-center pt-16 mt-16 border-t border-gray-300 mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:py-4 lg:px-8">
      <Logo className="mx-auto mb-6" />

      <div className="max-w-sm px-4 sm:max-w-full sm:text-center">
        <p className="text-2xl font-semibold text-gray-800 text-center">
          Inspiring and enabling sustainability
        </p>
      </div>
      <div className="mt-12 flex space-x-4 text-gray-600">
        <Link
          href="https://www.youtube.com/channel/UCM2X9PTXxUb4DElw4xCr4Cw"
          target="_blank"
        >
          <a target="_blank">
            <span className="sr-only">Follow us on YouTube</span>
            <YouTubeMonotoneIcon className="h-6 w-6 cursor-pointer duration-100 transition-colors hover:text-gray-800" />
          </a>
        </Link>
        <Link href="https://www.instagram.com/mission_sustainability/">
          <a target="_blank">
            <span className="sr-only">Follow us on Instagram</span>
            <InstagramMonotoneIcon className="h-6 w-6 cursor-pointer duration-100 transition-colors hover:text-gray-800" />
          </a>
        </Link>
        <Link
          href="https://www.linkedin.com/company/mission-sustainability/"
          target="_blank"
        >
          <a target="_blank">
            <span className="sr-only">Follow us on LinkedIn</span>
            <LinkedInMonotoneIcon className="h-6 w-6 cursor-pointer duration-100 transition-colors hover:text-gray-800" />
          </a>
        </Link>
        <Link href="https://twitter.com/MissionSustain1" target="_blank">
          <a target="_blank">
            <span className="sr-only">Follow us on Twitter</span>
            <TwitterMonotoneIcon className="h-6 w-6 cursor-pointer duration-100 transition-colors hover:text-gray-800" />
          </a>
        </Link>
      </div>
      <div className="my-6 flex w-full max-w-5xl flex-col items-center justify-between space-y-8 px-5">
        <div className="flex flex-col items-center text-gray-900 justify-center space-y-2 text-sm font-normal sm:flex sm:flex-row sm:space-x-2 md:space-y-0">
          <Link href="/wip">
            <a
              href="/wip"
              className="block underline-offset-4 decoration-transparent transition-colors hover:underline hover:decoration-gray-900"
            >
              About us
            </a>
          </Link>
          <span className="hidden sm:block">•</span>
          <Link href="/wip">
            <a
              href="/wip"
              className="block underline-offset-4 decoration-transparent transition-colors hover:underline hover:decoration-gray-900"
            >
              Why Mission Sustainability?
            </a>
          </Link>
          <span className="hidden sm:block">•</span>
          <Link href="/wip">
            <a
              href="/wip"
              className="block underline-offset-4 decoration-transparent transition-colors hover:underline hover:decoration-gray-900"
            >
              Join us
            </a>
          </Link>
          <span className="md:block hidden">&nbsp;•&nbsp;</span>
          <Link href="/wip">
            <a
              href="/wip"
              className="block underline-offset-4 decoration-transparent transition-colors hover:underline hover:decoration-gray-900"
            >
              Privacy
            </a>
          </Link>
          <span className="md:block hidden">&nbsp;•&nbsp;</span>
          <Link href="/wip">
            <a
              href="/wip"
              className="block underline-offset-4 decoration-transparent transition-colors hover:underline hover:decoration-gray-900"
            >
              Terms
            </a>
          </Link>
        </div>
      </div>

      <div className="flex flex-col items-center text-gray-900 justify-center space-y-2 text-sm font-normal sm:flex sm:flex-row sm:space-x-2 md:space-y-0">
        COPYRIGHT © {new Date().getFullYear()} - Mission Sustainability, India
      </div>
    </div>
  );
};

export default Footer;
