import { format, fromUnixTime } from 'date-fns';
import type { UnixTime } from './types';

export const getFormattedDate = (timestamp: UnixTime) =>
  format(fromUnixTime(timestamp), 'yyyy/MM/dd');
