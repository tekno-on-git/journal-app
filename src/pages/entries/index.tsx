import Loading from "@/components/Loading";
import NoEntries from "@/components/NoEntries";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Entries = () => {
  const { status: sessionStatus, data: sessionData } = useSession();
  const { replace } = useRouter();

  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      void replace("/");
    }
  }, [replace, sessionStatus]);
  if (sessionStatus === "loading") return <Loading />;
  if (!sessionData) return; //avoid the below return

  return (
    <>
      <Head>
        <title>Entries</title>
      </Head>
      <section className="mt-32 flex flex-col justify-center gap-10">
        <h1 className="font-poppins text-center  text-4xl font-bold text-neutral-50">
          Entries
        </h1>
        <NoEntries />
      </section>
    </>
  );
};

export default Entries;
