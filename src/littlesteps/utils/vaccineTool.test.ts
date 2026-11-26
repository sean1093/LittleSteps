import { describe, expect, it } from 'vitest';
import { vaccineSchedules } from '../data/vaccines';
import { resolveVaccineDoses, type ResolvedVaccineDose } from './vaccineSchedule';
import { buildVaccineIcs } from './vaccineCalendar';
import { schedulesStillAhead, vaccineDatesFor } from './vaccineTool';

/**
 * Every schedule row a listed line stands for. A line can stand for two: the
 * calculator folds alternative products due at the same visit into one.
 */
const rowsOf = (doses: ResolvedVaccineDose[]) =>
  doses.flatMap((dose) => dose.alternativeIds ?? [dose.vaccineId]);

/**
 * The public vaccine calculator must give the same dates as the tracker behind
 * sign-in, and must not call a dose overdue: it has no idea what was given.
 */
describe('vaccineDatesFor', () => {
  const today = new Date(2026, 5, 15); // 2026-06-15, local

  it('accounts for every dated dose exactly once, split by today', () => {
    const { upcoming, past } = vaccineDatesFor('2026-01-10', vaccineSchedules, today);
    const all = resolveVaccineDoses('2026-01-10', vaccineSchedules, {}, today);

    expect(rowsOf([...upcoming, ...past]).sort()).toEqual(all.map((dose) => dose.vaccineId).sort());
    expect(all.length).toBeGreaterThan(0);
    for (const dose of past) expect(dose.dueDate < '2026-06-15', dose.name).toBe(true);
    for (const dose of upcoming) expect(dose.dueDate >= '2026-06-15', dose.name).toBe(true);
  });

  it('gives the same dates as the tracker', () => {
    const { upcoming, past } = vaccineDatesFor('2026-01-10', vaccineSchedules, today);
    const tracker = resolveVaccineDoses('2026-01-10', vaccineSchedules, {}, today);
    const dueOn = new Map(tracker.map((dose) => [dose.vaccineId, dose]));
    const fromTool = [...past, ...upcoming].flatMap((dose) =>
      (dose.alternativeIds ?? [dose.vaccineId]).map((id) => [id, dose.doseNumber, dose.dueDate]),
    );
    const fromTracker = fromTool.map(([id]) => {
      const dose = dueOn.get(id as string)!;
      return [dose.vaccineId, dose.doseNumber, dose.dueDate];
    });
    expect(fromTool.length).toBe(tracker.length);
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
    expect(ahead.map((vaccine) => vaccine.id).sort()).toEqual(rowsOf(upcoming).sort());
  });

  it('exports one event per listed line, so the number on the button is what lands', () => {
    // A newborn: both rotavirus products are ahead and folded into one line per visit.
    const birthday = '2026-06-01';
    const { upcoming } = vaccineDatesFor(birthday, vaccineSchedules, today);
    const ics = buildVaccineIcs(
      { id: 'tool', name: '寶寶', birthday },
      schedulesStillAhead(birthday, vaccineSchedules, today),
      {},
      today,
    );

    expect(upcoming.some((dose) => dose.alternativeIds)).toBe(true);
    expect(ics.split('BEGIN:VEVENT').length - 1).toBe(upcoming.length);
  });

  it('shows two alternative products due the same day as one line, not two', () => {
    // #145: a parent of a 2-month-old read both rotavirus products as due.
    const { upcoming } = vaccineDatesFor('2026-06-01', vaccineSchedules, today);
    const rota = upcoming.filter((dose) => dose.vaccineId.startsWith('rotavirus-'));

    expect(rota.map((dose) => dose.name)).toEqual([
      '口服輪狀病毒疫苗 第1劑（2劑型或3劑型，擇一）',
      '口服輪狀病毒疫苗 第2劑（2劑型或3劑型，擇一）',
      '口服輪狀病毒疫苗（3劑型） 第3劑',
    ]);
    const visits = rota.map((dose) => dose.dueDate);
    expect(new Set(visits).size).toBe(visits.length);
  });

  it('does not call a rotavirus dose free for a child past the announced age limit', () => {
    // After 2027-01-01 the rows are publicly funded, but the announcement caps
    // the age at eight months; a ten-month-old must not read "公費" on them.
    const { past } = vaccineDatesFor('2026-04-01', vaccineSchedules, new Date(2027, 1, 1));
    const rota = past.filter((dose) => dose.vaccineId.startsWith('rotavirus-'));

    expect(rota.length).toBeGreaterThan(0);
    rota.forEach((dose) => expect(dose.setAside, dose.name).toBe('past-age-limit'));
  });
});
