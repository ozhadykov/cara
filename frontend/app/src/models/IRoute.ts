import {ReactElement} from "react";

export interface IRoute {
  path: string,
  label: string,
  component: ReactElement | string,
  icon?: ReactElement | string,
}