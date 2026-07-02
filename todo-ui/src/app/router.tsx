import type { ReactNode } from "react";

interface RouterProps {
  children: ReactNode;
}

export function Router({ children }: RouterProps) {
  return <>{children}</>;
}
