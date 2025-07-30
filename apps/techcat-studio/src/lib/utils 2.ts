import classNames from "classnames";

export function cn(...inputs: classNames.ArgumentArray): string {
  return classNames(...inputs);
}
