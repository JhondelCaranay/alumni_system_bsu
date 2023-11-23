import { useParams, useRouter } from "next/navigation";

const useRouterPush = () => {
  const router = useRouter();
  const params = useParams();
  const role = params?.role as string;

  const redirectTo = (path: string) => {
    router.push(`/${role}/${path}`);
  };

  return { redirectTo };
};
export default useRouterPush;
