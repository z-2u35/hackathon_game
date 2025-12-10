
import PublicGuard from "../providers/publicGuard";
import AuthSetup from "@/components/layouts/auth/AuthSetup";

// File này KHÔNG ĐƯỢC chứa <html> hay <body>
// Nó chỉ được bọc nội dung thôi
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PublicGuard>
      <AuthSetup>{children}</AuthSetup>
    </PublicGuard>
  );
}
