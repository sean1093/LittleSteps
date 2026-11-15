/**
 * The one "still loading" indicator: a thin indeterminate bar, announced once
 * through `role="status"`. No illustration and no layout jump.
 *
 * It sizes only itself. The caller decides how much room it sits in, because a
 * whole-page wait and a wait inside a service shell need different amounts.
 */
export default function LoadingBar() {
  return (
    <div className="w-40 h-1 rounded-full bg-primary-light overflow-hidden" role="status">
      <div className="h-full w-1/3 rounded-full bg-primary-dark animate-[loading_1.2s_ease-in-out_infinite]" />
      <span className="sr-only">載入中</span>
    </div>
  );
}
