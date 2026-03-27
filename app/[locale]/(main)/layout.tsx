import Header1 from "@/components/shared/headers";
import Footer from "@/components/shared/footer/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header1 />
      {children}
      <Footer />
    </>
  );
}