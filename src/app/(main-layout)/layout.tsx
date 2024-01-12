import getCurrentUser from "@/actions/getCurrentUser";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import PageWrapper from "./components/PageWrapper";
import SidebarWrapper from "./components/SidebarWrapper";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return null;
  }

  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-56 fixed inset-y-0 w-full z-50">
        <Navbar currentUser={currentUser} />
      </div>

      <SidebarWrapper>
        <Sidebar currentUser={currentUser} />
      </SidebarWrapper>
      <PageWrapper>{children}</PageWrapper>
    </div>
  );
};

export default DashboardLayout;
