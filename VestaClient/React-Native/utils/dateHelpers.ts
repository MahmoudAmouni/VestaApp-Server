import { PantryItem } from "@/features/pantry/pantry.types";

function parseYyyyMmDdLocal(s: string) {
  if (!s) return null;
  const parts = s.split("-");
  if (parts.length !== 3) return null;
  const [y, m, d] = parts.map(Number);
  return new Date(y, m - 1, d); 
}

export function daysFromToday(dateStr: string | null | undefined) {
  if (!dateStr) return 9999;
  const target = parseYyyyMmDdLocal(dateStr);
  if (!target) return 9999; 

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetStart = new Date(
    target.getFullYear(),
    target.getMonth(),
    target.getDate()
  );

  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((targetStart.getTime() - todayStart.getTime()) / msPerDay);
}

export function getExpiringSoon(pantry: PantryItem[]) {
  const expiringSoon = pantry.filter((item) => {
    if (!item.expiry_date) return false;
    const exp = daysFromToday(item.expiry_date);
    return exp < 7 && exp > 0;
  });
  return expiringSoon;
}
