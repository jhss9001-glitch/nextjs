"use client";

import { createContext, useContext, useState } from "react";
import { PLANS } from "@/lib/data";

export const DEFAULT_PLAN = PLANS.find((p) => p.featured).id;

const PlanContext = createContext(null);

// 수강료 카드의 버튼과 신청서의 플랜 선택이 같은 값을 공유합니다.
export function PlanProvider({ children }) {
  const [plan, setPlan] = useState(DEFAULT_PLAN);
  return <PlanContext.Provider value={{ plan, setPlan }}>{children}</PlanContext.Provider>;
}

export const usePlan = () => useContext(PlanContext);
