"use client";
import React, { useEffect, useRef, useState } from "react";
import Post from "./Post";
import CreateFeedInput from "./CreateFeedInput";
import { useQueryProcessor } from "@/hooks/useTanstackQuery";
import JobSkeletonList from "../../jobs/components/JobSkeletonList";
import { PostSchemaType } from "@/schema/post";
import { UserWithProfile } from "@/types/types";
import { GetCurrentUserType } from "@/actions/getCurrentUser";
import { PollOption } from "@prisma/client";
//  import Poll from 'react-polls';


type FeedProps = {
  currentUser: GetCurrentUserType
}

// const pollAnswers = [
//   { option: 'Yes', votes: 1 },
//   { option: 'No', votes: 2 },
//   { option: 'maybe', votes: 3 }
// ]

// const pollQuestion = 'Is react-polls useful?'

const Feed:React.FC<FeedProps> = ({currentUser}) => {

//   const [polling, setPolling] = useState([...pollAnswers])
// const handleVote = (voteAnswer:any) => {
//   const newPollAnswers = polling.map(answer => {
//     if (answer.option === voteAnswer) { 
//       answer.votes++
//       return answer
//     }
//     return answer
//   })

//   setPolling(newPollAnswers)
// }

// useEffect(() => {
//   const autoVote = setTimeout(() => {
//     handleVote('Yes')
//     handleVote('Maybe')
//   }, 1000)

//   return () => {
//     clearInterval(autoVote)
//   }

// }, [polling])

  const feed = useQueryProcessor<
    (PostSchemaType & { user: UserWithProfile, poll_options: PollOption[]})[]
  >("/posts", { type: "feed" }, ["discussions"]);

  if (feed.status === "pending" || feed.isFetching) {
    return (
      <div className="flex-1 flex flex-col items-center gap-y-5 max-h-[87vh] overflow-y-auto">
        <JobSkeletonList />
      </div>
    );
  }
  if (feed.status === "error") {
    return <div>someting went wrong...</div>;
  }

  console.log('update')
  return (
    <div className="flex-1 flex flex-col items-center gap-y-5 max-h-[87vh] overflow-y-auto">
      <CreateFeedInput />
        {/* <Poll question={pollQuestion} noStorage answers={pollAnswers} questionSeparator onVote={handleVote}  /> */}
    
      {feed.data.map((feedData) => (
        <Post key={feedData?.id || new Date().toString()} currentUser={currentUser} postData={feedData} />
      ))}
    </div>
  );
};

export default Feed;
