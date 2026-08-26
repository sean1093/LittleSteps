import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useChildStore } from './useChildStore';

// lib/firebase's analytics helpers are fire-and-forget side effects; stub them
// so the guest-mode paths under test don't reach real Firebase.
vi.mock('../../lib/firebase', () => ({
  database: {},
  logMilestoneToggle: vi.fn(),
  logVaccineToggle: vi.fn(),
  logChildProfileAction: vi.fn(),
}));

describe('useChildStore (guest / LocalStorage mode)', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal('alert', vi.fn());
    // addChild derives ids from Date.now(); make it strictly increasing so
    // rapid successive adds in tests get distinct ids (real usage is seconds apart).
    let tick = 0;
    vi.spyOn(Date, 'now').mockImplementation(() => 1_700_000_000_000 + tick++);
  });

  it('adds a child and auto-selects it', async () => {
    const { result } = renderHook(() => useChildStore(null));

    await act(async () => {
      await result.current.addChild('小明', '2026-01-01');
    });

    expect(result.current.childProfiles).toHaveLength(1);
    expect(result.current.childProfiles[0].name).toBe('小明');
    expect(result.current.currentChildId).toBe(result.current.childProfiles[0].id);
    expect(result.current.currentChild?.name).toBe('小明');
  });

  it('enforces the 2-child free-tier limit', async () => {
    const alertSpy = vi.fn();
    vi.stubGlobal('alert', alertSpy);
    const { result } = renderHook(() => useChildStore(null));

    await act(async () => {
      await result.current.addChild('A', '2026-01-01');
    });
    await act(async () => {
      await result.current.addChild('B', '2026-02-01');
    });
    expect(result.current.childProfiles).toHaveLength(2);

    await act(async () => {
      await result.current.addChild('C', '2026-03-01');
    });

    expect(result.current.childProfiles).toHaveLength(2);
    expect(alertSpy).toHaveBeenCalled();
  });

  it('toggles a milestone on and off for the current child', async () => {
    const { result } = renderHook(() => useChildStore(null));
    await act(async () => {
      await result.current.addChild('小明', '2026-01-01');
    });

    await act(async () => {
      await result.current.toggleMilestone('m1');
    });
    expect(result.current.currentChildMilestoneProgress['m1']?.achieved).toBe(true);

    await act(async () => {
      await result.current.toggleMilestone('m1');
    });
    expect(result.current.currentChildMilestoneProgress['m1']?.achieved).toBe(false);
  });

  it('toggles a vaccine dose administered state', async () => {
    const { result } = renderHook(() => useChildStore(null));
    await act(async () => {
      await result.current.addChild('小明', '2026-01-01');
    });

    await act(async () => {
      await result.current.toggleVaccineDose('bcg', 1, '2026-05-01');
    });

    const dose = result.current.currentChildVaccineProgress['bcg']?.doses[1];
    expect(dose?.administered).toBe(true);
    expect(dose?.administeredDate).toBe('2026-05-01');
  });

  it('switches the current child', async () => {
    const { result } = renderHook(() => useChildStore(null));
    await act(async () => {
      await result.current.addChild('A', '2026-01-01');
    });
    await act(async () => {
      await result.current.addChild('B', '2026-02-01');
    });
    const [a, b] = result.current.childProfiles;
    expect(result.current.currentChildId).toBe(b.id); // last added is selected

    await act(async () => {
      await result.current.setCurrentChild(a.id);
    });
    expect(result.current.currentChildId).toBe(a.id);
  });

  it('deletes a child and reselects the first remaining', async () => {
    const { result } = renderHook(() => useChildStore(null));
    await act(async () => {
      await result.current.addChild('A', '2026-01-01');
    });
    await act(async () => {
      await result.current.addChild('B', '2026-02-01');
    });
    const [a, b] = result.current.childProfiles;

    await act(async () => {
      await result.current.deleteChild(b.id);
    });

    expect(result.current.childProfiles).toHaveLength(1);
    expect(result.current.childProfiles[0].id).toBe(a.id);
    await waitFor(() => expect(result.current.currentChildId).toBe(a.id));
  });
});
