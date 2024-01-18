import Loading from "@/components/Loading";
import NoEntries from "@/components/NoEntries";
import { api } from "@/utils/api";
import moment from "moment";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Entries = () => {
  const { status: sessionStatus } = useSession();
  const { replace } = useRouter();

  const { data: entriesData } = api.journal.getAllEntries.useQuery(undefined, {
    enabled: sessionStatus === "authenticated",
  });

  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      void replace("/");
    }
  }, [replace, sessionStatus]);
  if (sessionStatus === "loading") return <Loading />;
  if (sessionStatus === "unauthenticated") return;

  return (
    <>
      <Head>
        <title>Entries</title>
      </Head>
      <section className="mt-32 flex flex-col justify-center gap-10">
        <h1 className="text-center font-poppins  text-4xl font-bold text-neutral-50">
          Entries
        </h1>
        {entriesData?.length === 0 ? (
          <NoEntries />
        ) : (
          entriesData?.map((entry) => (
            <Link
              href={`/entries/${entry.id}`}
              key={entry.id}
              className="mx-auto flex w-1/2 flex-row rounded-sm bg-slate-800 p-10"
            >
              <div className="trucate">
                <p className="font-poppins text-lg text-gray-50">
                  {entry.content}
                </p>
                <p className="font-montserrat text-gray-500">
                  {moment(entry.dateCreated).format("MMM Do YYYY")}
                </p>
              </div>
            </Link>
          ))
        )}
      </section>
    </>
  );
};

export default Entries;
