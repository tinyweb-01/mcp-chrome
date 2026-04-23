// step-types.ts — re-export shared constants to keep single source of truth
export { STEP_TYPES } from '@tinyweb_dev/chrome-mcp-shared';
export type StepTypeConst =
  (typeof import('@tinyweb_dev/chrome-mcp-shared'))['STEP_TYPES'][keyof (typeof import('@tinyweb_dev/chrome-mcp-shared'))['STEP_TYPES']];
