import { ReactNode } from "react";

export interface IRoute {
  path: string;
  label: string;
  component: ReactNode; // Verwende ReactNode
  icon?: ReactNode; // Verwende ReactNode
}