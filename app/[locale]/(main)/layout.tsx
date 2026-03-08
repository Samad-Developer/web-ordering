import Header1 from "@/components/shared/headers";
import Footer1 from "@/components/shared/footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header1 />
      {children}
      <Footer1 />
    </>
  );
}