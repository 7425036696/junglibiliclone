/**
 * Generates array of past dates in "day month" format (e.g., "1 Jul").
 */
export const getPastDates = (days: number, iso?: boolean): string[] => {
  const today = new Date();
  const dates = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);

    if (iso) {
      dates.push(d.toISOString());
    } else {
      dates.push(
        d.toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
        })
      );
    }
  }

  return dates;
};
