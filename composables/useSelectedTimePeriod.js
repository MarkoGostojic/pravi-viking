import {
  endOfYear,
  startOfYear,
  endOfMonth,
  startOfMonth,
  sub,
  startOfDay,
  endOfDay,
} from "date-fns";
export const useSelectedTimePeriod = (period) => {
  const dates = computed(() => {
    switch (period.value) {
      case "Godišnji":
        return {
          current: {
            from: startOfYear(new Date()),
            to: new Date(),
          },
          previus: {
            from: startOfYear(sub(new Date(), { years: 1 })),
            to: endOfYear(sub(new Date(), { years: 1 })),
          },
        };
      case "Mesečni":
        return {
          current: {
            from: startOfMonth(new Date()),
            to: new Date(),
          },
          previus: {
            from: startOfMonth(sub(new Date(), { months: 1 })),
            to: endOfMonth(sub(new Date(), { months: 1 })),
          },
        };
      case "Dnevni":
        return {
          current: {
            from: startOfDay(new Date()),
            to: new Date(),
          },
          previus: {
            from: startOfDay(sub(new Date(), { days: 1 })),
            to: endOfDay(sub(new Date(), { days: 1 })),
          },
        };
    }
  });
  return dates;
};
