import getCurrentUser from "@/actions/getCurrentUser";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import PageWrapper from "./components/PageWrapper";
import SidebarWrapper from "./components/SidebarWrapper";
import NavbarWrapper from "./components/NavbarWrapper";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return null;
  }

  return (
    <div className="h-full">
      <NavbarWrapper>
        <Navbar currentUser={currentUser} />
      </NavbarWrapper>

      <SidebarWrapper>
        <Sidebar currentUser={currentUser} />
      </SidebarWrapper>
      <PageWrapper>{children}</PageWrapper>
    </div>
  );
};

export default DashboardLayout;
