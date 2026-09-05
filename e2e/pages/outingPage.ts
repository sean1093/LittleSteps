import type { Locator, Page } from '@playwright/test';
import { ROUTE_PATH } from '../../src/types/routes';
import { SCROLL_ROW } from '../fixtures/testIds';

/**
 * LittleOuting — the family-centre and restaurant register.
 *
 * Selectors and navigation only; the assertions live in the specs (plan §9).
 */
export class OutingPage {
  /** `aria-label="搜尋親子館"`, which changes with the view. */
  readonly search: Locator;
  readonly cityRow: Locator;

  /**
   * The report action on a family-centre card. Its accessible name carries the
   * venue name after the label, because thirty cards in one list otherwise
   * announce the same three words; the prefix is what identifies the control.
   *
   * It renders only once `familyCentres.json` has arrived, so it doubles as
   * the signal that the register is on screen.
   */
  readonly reportButtons: Locator;

  /** The report form, portalled to `body` by `VenueReportButton`. */
  readonly reportForm: Locator;

  /**
   * The form's action while signed out.
   *
   * Writing a report needs `auth != null`, so the signed-out form explains why
   * and offers sign-in instead of a submit button — that button is the control
   * a parent has to be able to reach, and the only one Phase 1 can open.
   */
  readonly reportSignIn: Locator;

  constructor(private readonly page: Page) {
    this.search = page.getByRole('searchbox', { name: '搜尋親子館' });
    this.cityRow = page.getByTestId(SCROLL_ROW.outingCities);
    this.reportButtons = page.getByRole('button', { name: /^這裡的資訊不對？/ });
    this.reportForm = page.getByRole('dialog', { name: '這裡的資訊不對？' });
    this.reportSignIn = this.reportForm.getByRole('button', { name: '用 Google 登入' });
  }

  async goto(): Promise<void> {
    await this.page.goto(ROUTE_PATH.littleouting);
  }
}
