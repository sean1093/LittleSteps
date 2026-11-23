import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import type { Venue } from '../../types';
import { requiresAuth } from '../../common/routePolicy';
import { developmentCheckItems } from '../../littleexplorer/data/developmentChecks';
import { milestones } from '../../littlesteps/data/milestones';
import {
  DAILY_ACTIVITY_SOURCE,
  OUTING_SOURCES,
  OUTING_STAGES,
  PLACE_TYPES,
  type OutingSourceId,
} from './outingStages';

/**
 * The outing guide tells a parent what is safe for a child at a given stage.
 * These cases hold the rules that keep it honest: every health statement has
 * a source that was read, the stages leave no child without one, and nothing
 * the guide links to sits behind sign-in.
 */

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const centres = JSON.parse(
  readFileSync(join(ROOT, 'public', 'data', 'familyCentres.json'), 'utf8'),
) as Venue[];

/** Hosts a health claim may rest on: health agencies and paediatric bodies. */
const OFFICIAL_HOSTS = [
  'www.who.int',
  'www.hpa.gov.tw',
  'mammy.hpa.gov.tw',
  'www.cdc.gov.tw',
  'www.healthychildren.org',
];

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

describe('outing sources', () => {
  it.each(Object.entries(OUTING_SOURCES))('%s is an official page with a read date', (_id, source) => {
    const url = new URL(source.url);
    expect(url.protocol).toBe('https:');
    expect(OFFICIAL_HOSTS, `${url.hostname} is not a health agency or paediatric body`).toContain(
      url.hostname,
    );
    expect(source.verifiedOn).toMatch(ISO_DATE);
    expect(new Date(source.verifiedOn).getTime()).toBeLessThanOrEqual(Date.now());
    // The quoted wording is what lets the next reader re-check the sentence.
    expect(source.supports.length).toBeGreaterThan(20);
  });

  it('has no source that nothing cites', () => {
    const cited = new Set<OutingSourceId>([DAILY_ACTIVITY_SOURCE]);
    for (const stage of OUTING_STAGES) {
      for (const id of [
        ...stage.needs.sources,
        ...stage.pacing.sources,
        ...stage.safety.flatMap((item) => item.sources),
      ]) {
        cited.add(id);
      }
    }
    expect([...cited].sort()).toEqual(Object.keys(OUTING_SOURCES).sort());
  });
});

describe('outing stages', () => {
  it('cover every age from birth with no gap and no overlap', () => {
    // Half-open ranges: a child of exactly 6 months is in one stage, not two.
    expect(OUTING_STAGES[0].fromMonth).toBe(0);
    for (let index = 1; index < OUTING_STAGES.length; index += 1) {
      expect(OUTING_STAGES[index].fromMonth, OUTING_STAGES[index].id).toBe(
        OUTING_STAGES[index - 1].toMonth,
      );
    }
    expect(OUTING_STAGES[OUTING_STAGES.length - 1].toMonth).toBeNull();
  });

  it('have distinct ids and labels', () => {
    expect(new Set(OUTING_STAGES.map((stage) => stage.id)).size).toBe(OUTING_STAGES.length);
    expect(new Set(OUTING_STAGES.map((stage) => stage.label)).size).toBe(OUTING_STAGES.length);
  });

  it.each(OUTING_STAGES)('$id: every safety statement names its source', (stage) => {
    expect(stage.safety.length).toBeGreaterThanOrEqual(2);
    for (const item of stage.safety) {
      expect(item.sources.length, `unsourced: ${item.text}`).toBeGreaterThan(0);
    }
    // What the child needs is a claim about development; it is sourced too.
    expect(stage.needs.sources.length, `${stage.id} needs`).toBeGreaterThan(0);
  });

  it.each(OUTING_STAGES)('$id: a number of minutes or hours always has a source', (stage) => {
    // The activity figures are WHO's. A figure with no citation is a figure
    // someone typed from memory.
    for (const claim of [stage.needs, stage.pacing]) {
      if (/\d+\s*(分鐘|小時)/.test(claim.text)) {
        expect(claim.sources.length, `unsourced figure: ${claim.text}`).toBeGreaterThan(0);
      }
    }
  });

  it.each(OUTING_STAGES)('$id: recommends at least three kinds of place, none twice', (stage) => {
    const types = stage.places.map((place) => place.type);
    expect(types.length).toBeGreaterThanOrEqual(3);
    expect(new Set(types).size).toBe(types.length);
  });

  it('is preselected only by markers that exist in the milestone data', () => {
    const known = new Set([
      ...milestones.map((item) => item.id),
      ...developmentCheckItems.map((item) => item.id),
    ]);
    for (const stage of OUTING_STAGES) {
      for (const id of stage.reachedBy) {
        expect(known.has(id), `${stage.id} is reached by ${id}, which does not exist`).toBe(true);
      }
    }
    // The first stage is where every child starts; it has no entry marker.
    expect(OUTING_STAGES[0].reachedBy).toEqual([]);
    for (const stage of OUTING_STAGES.slice(1)) {
      expect(stage.reachedBy.length, stage.id).toBeGreaterThan(0);
    }
  });

  it('does not use one marker for two stages', () => {
    const all = OUTING_STAGES.flatMap((stage) => stage.reachedBy);
    expect(new Set(all).size).toBe(all.length);
  });
});

describe('place types', () => {
  it('are all recommended somewhere', () => {
    const used = new Set(OUTING_STAGES.flatMap((stage) => stage.places.map((place) => place.type)));
    expect([...used].sort()).toEqual(Object.keys(PLACE_TYPES).sort());
  });

  it('never send a parent to a page that needs sign-in', () => {
    // The guide is public. A link from it into a gated page would land a
    // signed-out parent on an intro page instead of the thing they tapped.
    for (const [id, type] of Object.entries(PLACE_TYPES)) {
      if (type.action.kind === 'service') {
        expect(requiresAuth(type.action.page), id).toBe(false);
      }
    }
  });

  it('say the family centres admit 0 to 6 only while the register says so', () => {
    const line = OUTING_STAGES.flatMap((stage) => stage.places).find((place) =>
      place.why.includes('0 到 6 歲'),
    );
    expect(line, 'the sentence was reworded; update this rule').toBeDefined();
    for (const centre of centres) {
      expect(centre.ageYears, centre.name).toEqual([0, 6]);
    }
  });
});
