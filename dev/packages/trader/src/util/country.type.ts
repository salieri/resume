import { getCodes } from 'country-list';
import { z } from 'zod/v4';

export const CountryCode = z.enum(getCodes()).brand('CountryCode');

export type CountryCode = z.infer<typeof CountryCode>;
