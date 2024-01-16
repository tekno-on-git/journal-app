import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { Poppins, Montserrat } from "next/font/google";

import { api } from "@/utils/api";

import "@/styles/globals.css";

const poppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["100", "400", "800"],
  variable: "--font-poppins",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300"],
  variable: "--font-montserrat",
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <div className={`${poppinsFont.variable} ${montserrat.variable}`}>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </div>
  );
};

export default api.withTRPC(MyApp);
