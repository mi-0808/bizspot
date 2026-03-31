/**
 * 営業中かどうかを判定する
 * Google Places の opening_hours.open_now を優先し、なければ独自判定
 */
export function isCurrentlyOpen(
  openNow: boolean | undefined,
  periods?: { open: { day: number; time: string }; close?: { day: number; time: string } }[]
): boolean | null {
  if (openNow !== undefined) return openNow;
  if (!periods) return null;

  const now = new Date();
  const currentDay = now.getDay();
  const currentTime = now.getHours() * 100 + now.getMinutes();

  const todayPeriod = periods.find((p) => p.open.day === currentDay);
  if (!todayPeriod) return false;

  const openTime = parseInt(todayPeriod.open.time, 10);
  const closeTime = todayPeriod.close ? parseInt(todayPeriod.close.time, 10) : 2359;

  return currentTime >= openTime && currentTime <= closeTime;
}

/**
 * 指定した時間帯に営業しているかチェック
 * startTime, endTime は "HH:MM" 形式
 */
export function isOpenDuringTime(
  periods: { open: { day: number; time: string }; close?: { day: number; time: string } }[] | undefined,
  startTime: string,
  endTime: string
): boolean {
  if (!periods || !startTime || !endTime) return true;

  const now = new Date();
  const currentDay = now.getDay();

  const toMinutes = (hhmm: string) => {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
  };

  const start = toMinutes(startTime);
  const end = toMinutes(endTime);

  return periods.some((p) => {
    if (p.open.day !== currentDay) return false;
    const openMin = toMinutes(p.open.time.replace(/(\d{2})(\d{2})/, "$1:$2"));
    const closeMin = p.close
      ? toMinutes(p.close.time.replace(/(\d{2})(\d{2})/, "$1:$2"))
      : 24 * 60;
    return openMin <= start && closeMin >= end;
  });
}

export function formatOpenStatus(isOpen: boolean | null): string {
  if (isOpen === null) return "営業時間不明";
  return isOpen ? "営業中" : "営業時間外";
}
