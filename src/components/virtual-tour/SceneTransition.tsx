import type { ReactNode } from "react";

type SceneTransitionProps = {
  children: ReactNode;
};

/**
 * F1 stub — passes children through untouched. F3 wraps real scene
 * cross-fade timing here once Pannellum scene switching exists, so the
 * rest of the tree never needs to know a transition is happening.
 */
export function SceneTransition({ children }: SceneTransitionProps) {
  return <>{children}</>;
}
