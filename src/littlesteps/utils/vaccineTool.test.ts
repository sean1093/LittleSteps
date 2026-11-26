import { describe, expect, it } from 'vitest';
import { vaccineSchedules } from '../data/vaccines';
import { resolveVaccineDoses } from './vaccineSchedule';
import { schedulesStillAhead, vaccineDatesFor } from './vaccineTool';

/**
 * The public vaccine calculator must give the same dates as the tracker behind
 * sign-in, and must not call a dose overdue: it has no idea what was given.
 */
describe('vaccineDatesFor', () => {
  const today = new Date(2026, 5, 15); // 2026-06-15, local

  it('accounts for every dated dose exactly once, split by today', () => {
    const { upcoming, past } = vaccineDatesFor('2026-01-10', vaccineSchedules, today);
    const all = resolveVaccineDoses('2026-01-10', vaccineSchedules, {}, today);

    expect(upcoming.length + past.length).toBe(all.length);
    expect(all.length).toBeGreaterThan(0);
    for (const dose of past) expect(dose.dueDate < '2026-06-15', dose.name).toBe(true);
    for (const dose of upcoming) expect(dose.dueDate >= '2026-06-15', dose.name).toBe(true);
  });

  it('gives the same dates as the tracker', () => {
    const { upcoming, past } = vaccineDatesFor('2026-01-10', vaccineSchedules, today);
    const fromTool = [...past, ...upcoming].map((dose) => [dose.vaccineId, dose.doseNumber, dose.dueDate]);
    const fromTracker = resolveVaccineDoses('2026-01-10', vaccineSchedules, {}, today).map((dose) => [
      dose.vaccineId,
      dose.doseNumber,
      dose.dueDate,
    ]);
    expect(fromTool).toEqual(fromTracker);
  });

  it('lists what comes next soonest first', () => {
    const { upcoming } = vaccineDatesFor('2026-01-10', vaccineSchedules, today);
    const dates = upcoming.map((dose) => dose.dueDate);
    expect(dates).toEqual([...dates].sort());
  });

  it('puts every dose ahead for a baby not born yet', () => {
    const { upcoming, past } = vaccineDatesFor('2026-09-01', vaccineSchedules, today);
    expect(past).toEqual([]);
    expect(upcoming.length).toBeGreaterThan(0);
  });

  it('counts a dose suggested for today as still ahead', () => {
    const birthDose = vaccineDatesFor('2026-06-15', vaccineSchedules, today).upcoming[0];
    expect(birthDose.dueDate).toBe('2026-06-15');
  });

  it('exports to the calendar exactly the doses it lists as ahead', () => {
    const { upcoming } = vaccineDatesFor('2026-01-10', vaccineSchedules, today);
    const ahead = schedulesStillAhead('2026-01-10', vaccineSchedules, today);
    expect(ahead.map((vaccine) => vaccine.id).sort()).toEqual(
      upcoming.map((dose) => dose.vaccineId).sort(),
    );
  });
});
