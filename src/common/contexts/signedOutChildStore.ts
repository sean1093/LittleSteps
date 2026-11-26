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
 * Signed in, but the store has not reported yet: either its code is still on
 * the way or the first snapshot is. Everything is as empty as above except
 * that it says so, which keeps the app on its loading bar rather than showing
 * "you have no children" to a parent who has two.
 */
export const LOADING_CHILD_STORE: ChildStore = {
  ...SIGNED_OUT_CHILD_STORE,
  childrenLoading: true,
};
