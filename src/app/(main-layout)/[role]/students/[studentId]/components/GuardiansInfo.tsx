"use client";
import { UserX } from "lucide-react";
import React from "react";
import Guardian from "./Guardian";
import { GetCurrentUserType } from "@/actions/getCurrentUser";
import { useQueryProcessor } from "@/hooks/useTanstackQuery";
import { GuardianSchemaType } from "@/schema/guardian";
import { Loader, Loader2 } from "@/components/ui/loader";

type GuardianInfoProps = {
  data: GetCurrentUserType;
  studentProfileId?: string;
};

const GuardianInfo: React.FC<GuardianInfoProps> = ({
  data,
  studentProfileId,
}) => {
  const guardians = useQueryProcessor<GuardianSchemaType[]>(
    "/guardians?studentProfileId=" + studentProfileId,
    null,
    ["guardians"]
  );

  return (
    <div className="flex flex-col  w-full p-5 rounded-lg gap-5 bg-white dark:bg-[#1F2937]">
      <h1 className="text-3xl">Family and relationships</h1>

      {(() => {
        if (guardians.status === "pending" || guardians.isFetching) {
          return <Loader2 className="mx-auto" color="#3498db" size={30} />;
        }

        if (
          typeof guardians.data === "undefined" ||
          guardians.data.length <= 0
        ) {
          return (
            <div className="text-center gap-x-2 flex items-center justify-center text-zinc-500">
              {" "}
              <UserX /> No Guardians
            </div>
          );
        }

        return (
          <section className="flex flex-col gap-y-5">
            {guardians.data.map((guardian) => (
              <Guardian data={guardian} key={guardian.id} />
            ))}
          </section>
        );
      })()}
    </div>
  );
};

export default GuardianInfo;
