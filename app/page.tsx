'use client';
import MenuWrapper from "@/components/menu";
import { useMenu } from "@/contexts/MenuContext";
export default function Home() {
const { loading } = useMenu();
  return (
    <div className="min-h-screen">
      {
         loading && (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading menu...</p>
        </div>
      </div>
    )}
      <MenuWrapper />
    </div>
  );
}
