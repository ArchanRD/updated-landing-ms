import React, { PropsWithChildren } from "react";
import Footer from "./Footers";
import Header from "./Header";

type Props = {};

const Layout: React.FC<PropsWithChildren<Props>> = ({ children }) => {
  return (
    <div>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
