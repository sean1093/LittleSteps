import { expect, test } from '../fixtures/test';
import { BabyOasisPage } from '../pages/babyOasisPage';

/**
 * The harness smoke check — it proves the harness, not the app.
 *
 * Deliberately the only spec in the tree until E2E-02 lands: it is the one
 * assertion that fails if the production build, the dummy Firebase
 * configuration, the preview server, the route blocking or either viewport
 * project is wrong, and it names none of the catalogue's cases.
 *
 * `/babyoasis` earns the job because it exercises the most of that chain: a
 * public route, a lazy chunk, a 1.1 MB runtime-fetched dataset, and a Leaflet
 * map whose tiles are blocked. The search input only renders once the dataset
 * has loaded, so its presence is a real signal rather than a shell check.
 *
 * Tagged `@p0` so `npm run test:e2e:p0` has something to run; the priority
 * tags themselves are the plan's §10 mechanism.
 */
test('@p0 BabyOasis loads and offers its search input', async ({ page }) => {
  const babyOasis = new BabyOasisPage(page);

  await babyOasis.goto();

  await expect(babyOasis.search).toBeVisible();
  await expect(page).toHaveURL(/\/babyoasis$/);
});
