"use client";

import { ToastProvider } from "@/context/ToastContext";
import { PlanProvider } from "@/context/PlanContext";

export default function Providers({ children }) {
  return (
    <ToastProvider>
      <PlanProvider>{children}</PlanProvider>
    </ToastProvider>
  );
}
