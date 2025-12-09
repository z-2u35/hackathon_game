import PublicSetup from "@/components/layouts/public/PublicSetup"; 

// File này KHÔNG ĐƯỢC chứa <html> hay <body>
// Nó chỉ được bọc nội dung thôi
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PublicSetup>
      {children}
    </PublicSetup>
  );
}