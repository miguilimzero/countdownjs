export function countdown(options: {
  seconds: number;
  template?: string;
  withPadding?: boolean;
  onTick?: (formatted: string, remaining: number) => void;
  onFinish?: () => void;
}): number | undefined;

export function countup(options: {
  time: number;
  locale?: string;
  format?: Intl.DateTimeFormatOptions;
  onTick?: (formatted: string) => void;
}): number | undefined;