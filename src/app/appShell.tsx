"use client";

import { usePathname } from "next/navigation";
import Header from "@/core/ui/header/header";
import Footer from "@/core/ui/footer/footer";

interface Props {
  children: React.ReactNode;
}

export const AppShell: React.FC<Props> = ({ children }) => {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <>
      {!isLoginPage && <Header />}
      <main
        style={{
          paddingTop: isLoginPage ? "0" : "60px",
          paddingBottom: isLoginPage ? "0" : "40px",
        }}
      >
        {children}
      </main>
      {!isLoginPage && <Footer />}
    </>
  );
};
