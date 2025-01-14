"use client";
import { useOrders } from "@/hooks/useOrders";
import Agenda from "@/app/components/Agenda";

export default function Home() {
  const { orders, isLoading, error } = useOrders();

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-2xl space-y-8 mt-10">
          <h1 className="text-4xl font-bold text-center text-red-500">Erreur</h1>
          <p className="text-center">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-4 pt-20">
      <div className="w-full space-y-8 mt-10">
        {isLoading ? (
          <div className="flex justify-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <Agenda orders={orders} />
          </>
        )}
      </div>
    </div>
  );
}
