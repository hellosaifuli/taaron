"use client";

import { useEffect } from "react";
import { fbEvent } from "@/lib/fb-pixel";

interface Props {
  orderId: string;
  total: number;
  contentIds: string[];
  numItems: number;
}

export default function FbPurchaseEvent({ orderId, total, contentIds, numItems }: Props) {
  useEffect(() => {
    fbEvent("Purchase", {
      content_ids: contentIds,
      content_type: "product",
      num_items: numItems,
      value: total,
      currency: "BDT",
      order_id: orderId,
    });
  }, []);

  return null;
}
