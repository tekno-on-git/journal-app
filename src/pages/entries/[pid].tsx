import Loading from "@/components/Loading";
import { api } from "@/utils/api";
import { TrashIcon } from "@heroicons/react/16/solid";
import moment from "moment";
import { useSession } from "next-auth/react";
import Head from "next/head";

import { useRouter } from "next/router";
import { useEffect } from "react";

const Entry = () => {
  const { status: sessionStatus } = useSession();
  const { replace, query } = useRouter();
  const entryId = Array.isArray(query.pid) ? query.pid[0] : query.pid;

  const { data: entryData, refetch: refetchEntry } =
    api.journal.getEntryById.useQuery(
      { id: entryId! },
      {
        enabled: entryId !== undefined,
      },
    );
  const { mutate: deleteEntry } = api.journal.deleteEntry.useMutation({
    onSuccess() {
      void replace("/entries");
    },
  });

  const { mutate: rateMoodMutation, status: rateMoodStatus } =
    api.ai.rateEntry.useMutation({
      onSuccess() {
        void refetchEntry();
      },
    });

  const ratingToEmoji = (rating: number): { text: string; color: string } => {
    if (rating < 2) {
      return {
        text: "Very Sad 😭",
        color: "bg-red-700",
      };
    } else if (rating <= 4) {
      return {
        text: "Sad 😔",
        color: "bg-orange-700",
      };
    } else if (rating === 5) {
      return {
        text: "Normal 😐",
        color: "bg-indigo-700",
      };
    } else if (rating <= 8) {
      return {
        text: "Happy 🙂",
        color: "bg-teal-700",
      };
    }
    return { text: "", color: "" };
  };

  useEffect(() => {
    if (sessionStatus === "unauthenticated") void replace("/");
  }, [sessionStatus, replace]);
  if (sessionStatus === "loading") return <Loading />;
  if (sessionStatus === "unauthenticated") return;

  return (
    <>
      <Head>
        <title>Entry</title>
      </Head>
      <section className="mt-32 flex-col justify-center gap-10">
        {entryData !== null && (
          <div className="mx-auto flex w-1/2 flex-col gap-5">
            <div className="flex flex-row items-center justify-between">
              <h1 className="font-poppins text-3xl text-gray-50">
                {moment(entryData?.dateCreated).format("MMM D, YYYY")}
              </h1>
              {entryData?.moodRating === null && (
                <button
                  className={`flex justify-center rounded-sm bg-gradient-to-br from-sky-700 to-sky-800 p-2 px-8 font-poppins font-bold text-gray-50 ${rateMoodStatus === "loading" && "cursor-not-allowed"}`}
                  onClick={() => rateMoodMutation({ id: entryId! })}
                  disabled={rateMoodStatus === "loading"}
                >
                  Analyse Mood
                </button>
              )}
              <button
                className="rounded-sm bg-gradient-to-br from-gray-700 to-gray-800 p-2"
                onClick={() => deleteEntry({ id: entryId! })}
              >
                <TrashIcon width={25} className="text-gray-50" />
              </button>
            </div>
            {entryData?.moodRating && (
              <div
                className={`w-max justify-center rounded-2xl p-3 font-poppins text-lg text-gray-50
               ${ratingToEmoji(entryData.moodRating).color}`}
              >
                {ratingToEmoji(entryData.moodRating).text}
              </div>
            )}
            <p className="whitespace-pre-line bg-gray-900 p-5 font-montserrat text-lg text-gray-50 ">
              {entryData?.content}
            </p>
          </div>
        )}
      </section>
    </>
  );
};

export default Entry;
