"use client";

import { useEffect, useRef } from "react";

// 화면에 들어오면 .in 클래스를 붙여 등장 효과를 줍니다. (vanilla와 같이 DOM 클래스를 직접 추가)
export default function Reveal({ as: Tag = "div", className = "", children, ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!("IntersectionObserver" in window)) {
      el.classList.add("in");
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return <Tag ref={ref} className={`reveal ${className}`.trim()} {...rest}>{children}</Tag>;
}
