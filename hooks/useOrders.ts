import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot, DocumentData } from "firebase/firestore";
import { db } from "@/services/firebase.service";
import { EOrderStatus, type IOrder } from "@/types/order";

export function useOrders() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);

    try {
      const q = query(collection(db, "orders"), orderBy("purchaseTimestamp", "desc"));

      const unsubscribe = onSnapshot(
        q,
        (snapshot: DocumentData) => {
          const newOrders: IOrder[] = snapshot.docs
            .map((doc: DocumentData) => {
              const data = doc.data();
              return {
                id: doc.id,
                email: data.email,
                endDate: data.endDate,
                filePath: data.filePath,
                intent: data.intent,
                purchaseTimestamp: data.purchaseTimestamp,
                sessionId: data.sessionId,
                status: data.status,
                userId: data.userId,
                timeline: data.timeline,
                service: data.service,
                displayName: data.displayName,
                fixedFilePath: data.fixedFilePath,
              };
            })
            .filter(
              (order: IOrder) =>
                order.status === EOrderStatus.PAID ||
                order.status === EOrderStatus.IN_PROGRESS ||
                order.status === EOrderStatus.DONE
            );

          setOrders(newOrders);
          setIsLoading(false);
        },
        (err) => {
          console.error("Erreur lors de la récupération des orders:", err);
          setError(err.message);
          setIsLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error("Erreur lors de l'initialisation:", err);
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      setIsLoading(false);
    }
  }, []);

  return { orders, isLoading, error };
}
