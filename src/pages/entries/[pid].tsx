import { useSession } from "next-auth/react";
import Head from "next/head";

import { useRouter } from "next/router";
import { useEffect } from "react";

const Entry = () => {
  const { status: sessionStatus, data: sessionData } = useSession();
  const { replace } = useRouter();
  useEffect(() => {
    if (sessionStatus === "unauthenticated") void replace("/");
  }, [sessionStatus, replace]);
  return (
    <>
      <Head>
        <title>Entry</title>
      </Head>
      <section className="mt-32 flex-col justify-center gap-10"></section>
    </>
  );
};

export default Entry;
