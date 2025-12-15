import { parseISO } from 'date-fns';
import type { RefinementCtx } from 'zod/v4';
import { z } from 'zod/v4';

export const fromISOLikeDate = (iso8601Date: string, zodContext: RefinementCtx): Date | null => {
  if (!iso8601Date) {
    zodContext?.addIssue('Invalid string representation of an ISO8601 date/datetime/time (p1)');
    return null;
  }

  const d = parseISO(iso8601Date);

  if (!Number.isNaN(d.getTime())) {
    return new Date(d);
  }

  const d2 = new Date(iso8601Date);

  if (!Number.isNaN(d2.getTime())) {
    return new Date(d2);
  }

  zodContext.addIssue('Invalid string representation of an ISO8601 date/datetime/time (p2)');
  return null;
};

export const Timestamp = z
  .union([
    z.date(),
    z.string().transform((date, ctx) => {
      try {
        return fromISOLikeDate(date, ctx) || z.NEVER;
      } catch (error) {
        ctx.addIssue({
          code: 'custom',
          message:
            error &&
            typeof error === 'object' &&
            'message' in error &&
            typeof error.message === 'string'
              ? error.message
              : JSON.stringify(error),
        });

        return z.NEVER;
      }
    }),
    z.number().transform((t) => (t > 7_258_147_200 ? new Date(t) : new Date(t * 1000))),
  ])
  .pipe(z.date())
  .brand('Timestamp');

export type Timestamp = z.infer<typeof Timestamp>;
