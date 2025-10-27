import { JSX, LazyExoticComponent } from "react";

export interface Page {
  component: LazyExoticComponent<() => JSX.Element>;
  path: string;
  createPath: (...args: string[]) => string;
  name: string;
}
