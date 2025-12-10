import UserSetup from "@/components/layouts/user/UserSetup";
import AuthProvider from "../providers/authProvider";
// File này KHÔNG ĐƯỢC chứa <html> hay <body>
// Nó chỉ được bọc nội dung thôi
export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <UserSetup>{children}</UserSetup>
    </AuthProvider>
  );
}
