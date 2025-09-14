import { useEffect, useState } from "react";
import api from "@/api/axios";

export default function PaymentStatus() {
  const [txRef, setTxRef] = useState<string | null>(null);
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    // Extract query params from hash
    const hash = window.location.hash; // "#payment-status-one?tx_ref=ORD-1234"
    const queryString = hash.split("?")[1];
    const params = new URLSearchParams(queryString);
    const ref = params.get("tx_ref");
    setTxRef(ref);
  }, []);

  useEffect(() => {
    if (txRef) {
      api
        .get(`/product/order/${txRef}`)
        .then((res) => setStatus(res.data.paymentStatus))
        .catch(() => setStatus("failed"));
    }
  }, [txRef]);

  return <div>Payment Status: {status}</div>;
}
