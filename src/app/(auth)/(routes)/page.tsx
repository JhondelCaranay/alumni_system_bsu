import React from "react";
import AuthForm from "../components/AuthForm";
import getCurrentUser from "@/actions/getCurrentUser";
import { redirect } from "next/navigation";
const LoginPage = async () => {
  const currentUser = await getCurrentUser();
  if (currentUser) {
    if (["STUDENT", "ALUMNI"].includes(currentUser.role)) {
      redirect(`/${currentUser.role.toLowerCase()}/forums`);
    } else {
      redirect(`/${currentUser.role.toLowerCase()}/profile`);
    }
  }

  return (
    <div className="flex h-full w-full justify-center items-center bg-[url(/assets/CIT_1.jpg)] bg-cover bg-bottom">
      <div className="w-full h-full absolute bg-[#000000a2]" />
      <AuthForm />
    </div>
  );
};

export default LoginPage;
