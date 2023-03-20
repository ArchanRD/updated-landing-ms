import React, { PropsWithChildren } from "react";
import Footer from "./LandingPage/Footer";
import Header from "./Header";
import ScrollToTop from "./ScrollToTop";

type Props = {};

const Layout: React.FC<PropsWithChildren<Props>> = ({ children }) => {
  return (
    <div>
      <ScrollToTop />
      <Header />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
