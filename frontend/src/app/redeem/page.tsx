"use client";

import React, { Suspense } from "react";
import ActualRedeemPage from "./ActualRedeemPage";

export default function RedeemPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-xl">Loading...</p>
        </div>
      }
    >
      <ActualRedeemPage />
    </Suspense>
  );
}
