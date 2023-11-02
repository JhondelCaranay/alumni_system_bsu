import getCurrentUser from "@/actions/getCurrentUser";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const currentUser = await getCurrentUser();
  console.log("🚀 ~ file: layout.tsx:7 ~ DashboardLayout ~ currentUser:", currentUser);

  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-56 fixed inset-y-0 w-full z-50">
        <Navbar currentUser={currentUser} />
      </div>
      <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
        <Sidebar />
      </div>
      <main className="md:pl-56 pt-[80px] h-full">{children}</main>
    </div>
  );
};

export default DashboardLayout;
