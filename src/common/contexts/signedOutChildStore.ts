import type { ChildStore } from '../hooks/useChildStore';

const nothing = async () => {};

/**
 * The child store as it is for someone who is not signed in: no children, and
 * mutators that do nothing.
 *
 * `useChildStore(null)` returns exactly this, and that is where it used to come
 * from. It is written out here so that a signed-out visit does not have to load
 * the hook, and with it the database SDK, to be told there is nothing to read.
 * Every member is listed by hand so that adding one to `ChildStore` fails to
 * compile here until its signed-out behaviour has been decided.
 */
export const SIGNED_OUT_CHILD_STORE: ChildStore = {
  childProfiles: [],
  currentChildId: null,
  currentChild: undefined,
  currentChildMilestoneProgress: {},
  currentChildVaccineProgress: {},
  currentChildDevelopmentProgress: {},
  currentChildToothProgress: {},
  childrenLoading: false,
  toggleMilestone: nothing,
  setMilestone: nothing,
  setVaccineDose: nothing,
  addChild: nothing,
  joinChild: nothing,
  updateChild: nothing,
  deleteChild: nothing,
  readChildExport: async () => {
    throw new Error('User not authenticated');
  },
  deleteAccountData: nothing,
  removeMember: nothing,
  setMemberName: nothing,
  setJoinOpen: nothing,
  setCurrentChild: nothing,
  toggleDevelopmentCheck: nothing,
  toggleTooth: nothing,
  pregnancyChild: undefined,
  pregnancyPrenatalProgress: {},
  upsertPrenatalRecord: nothing,
  clearPrenatalRecord: nothing,
  recordBirth: nothing,
  upsertCareTaskRecord: nothing,
  clearCareTaskRecord: nothing,
  addDiaryEntry: async () => undefined,
  updateDiaryEntry: nothing,
  deleteDiaryEntry: nothing,
};

/**
 * A write attempted while the store is still loading.
 *
 * Public pages render before a signed-in parent's child list arrives (#162),
 * and the shell's account sheet is on every one of them. A mutator that
 * quietly resolved here would let "delete my account" skip the data step and
 * go on to delete the Auth user, stranding a child's record nobody can read or
 * delete; and "add a baby" would close its form as if it had saved. Rejecting
 * sends both down the error paths they already have.
 */
const stillLoading = async (): Promise<never> => {
  throw new Error('The child list is still loading');
};

/**
 * Signed in, but the store has not reported yet: either its code is still on
 * the way or the first snapshot is. Everything is as empty as above except
 * that it says so, and that every write is refused (see stillLoading). Gated
 * pages and the landing page wait on the loading bar rather than showing "you
 * have no children" to a parent who has two; public pages render meanwhile.
 */
export const LOADING_CHILD_STORE: ChildStore = {
  ...(Object.fromEntries(
    Object.entries(SIGNED_OUT_CHILD_STORE).map(([key, value]) => [
      key,
      typeof value === 'function' ? stillLoading : value,
    ]),
  ) as unknown as ChildStore),
  childrenLoading: true,
};
