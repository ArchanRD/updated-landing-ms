import { ArrowCircleUpIcon } from "@untitledui/icons/outline";
import clsx from "clsx";
import React, { useEffect, useState } from "react";

type Props = {};

const ScrollToTop = (props: Props) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 500) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);
  return (
    <button
      className={clsx(
        isVisible ? "opacity-100" : "opacity-0",
        "fixed p-1.5 bg-green-50 text-green-600 font-medium text-xs leading-tight uppercase rounded-full shadow-md hover:bg-green-100 hover:shadow-lg focus:bg-green-200 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-200 active:shadow-lg transition duration-150 ease-in-out bottom-5 right-5"
      )}
      onClick={scrollToTop}
    >
      <div className="sr-only">scroll to top</div>
      <ArrowCircleUpIcon className="h-10 w-10" aria-hidden={true} />
    </button>
  );
};

export default ScrollToTop;
