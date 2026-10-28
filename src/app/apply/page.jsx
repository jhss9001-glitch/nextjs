import { Suspense } from "react";
import ApplyForm from "@/components/ApplyForm.jsx";

export const metadata = { title: "수강 신청" };

export default function ApplyPage() {
  // ApplyForm이 주소의 ?plan= 을 읽으므로 Suspense로 감싸 나머지는 정적으로 미리 생성
  return (
    <Suspense>
      <ApplyForm />
    </Suspense>
  );
}
