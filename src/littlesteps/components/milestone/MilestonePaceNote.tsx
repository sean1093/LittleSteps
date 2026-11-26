/**
 * The one sentence about pace that sits beside every milestone.
 *
 * A checklist with dates on it reads as a deadline. This says, once and in the
 * same words wherever milestones are shown, that a month or two late is
 * ordinary — and names the three things that are worth raising with a doctor,
 * so the reassurance does not turn into "never worry".
 *
 * 來源（2026-11-26 查證）：衛生福利部「兒童健康手冊」——於兒童健檢時主動與醫師討論
 * https://www.mohw.gov.tw/cp-16-58340-1.html
 */
export default function MilestonePaceNote({ className = '' }: { className?: string }) {
  return (
    <p className={`text-sm text-ink-muted leading-relaxed ${className}`}>
      每個孩子的步調不同，晚一兩個月很常見。這個月齡區間過了仍做不到、原本會的突然不會，或身體特別軟或特別僵硬，請在兒童健檢時告訴醫師，或提早回診。
    </p>
  );
}
