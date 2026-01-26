import { daysFromToday, getExpiringSoon } from '../dateHelpers';

describe('daysFromToday', () => {
  test('returns 9999 for null or undefined', () => {
    expect(daysFromToday(null)).toBe(9999);
    expect(daysFromToday(undefined)).toBe(9999);
  });

  test('returns 9999 for invalid date strings', () => {
    expect(daysFromToday('invalid-date')).toBe(9999);
    expect(daysFromToday('2026/01/26')).toBe(9999);
  });

  test('returns 0 for today', () => {
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    expect(daysFromToday(dateStr)).toBe(0);
  });

  test('returns positive number for future dates', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
    expect(daysFromToday(dateStr)).toBe(1);
  });

  test('returns negative number for past dates', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
    expect(daysFromToday(dateStr)).toBe(-1);
  });
});

describe('getExpiringSoon', () => {
  const getDateStr = (daysDiff: number) => {
    const date = new Date();
    date.setDate(date.getDate() + daysDiff);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const createItem = (id: number, expiryDate: string | null): any => ({
    id,
    name: `Item ${id}`,
    expiry_date: expiryDate,
  });

  test('includes items expiring in 1-6 days', () => {
    const items = [
      createItem(1, getDateStr(3)), 
      createItem(2, getDateStr(5)), 
    ];
    expect(getExpiringSoon(items as any)).toHaveLength(2);
  });

  test('excludes items expiring today (0 days)', () => {
    const items = [
      createItem(1, getDateStr(0)), 
    ];
    expect(getExpiringSoon(items as any)).toHaveLength(0);
  });

  test('excludes items expiring in 7 days or more', () => {
    const items = [
      createItem(1, getDateStr(7)), 
      createItem(2, getDateStr(10)), 
    ];
    expect(getExpiringSoon(items as any)).toHaveLength(0);
  });

  test('excludes items already expired (negative days)', () => {
    const items = [
      createItem(1, getDateStr(-1)), 
      createItem(2, getDateStr(-5)), 
    ];
    expect(getExpiringSoon(items as any)).toHaveLength(0);
  });

  test('excludes items with no expiry date', () => {
    const items = [
      createItem(1, null),
      createItem(2, ''),
    ];
    expect(getExpiringSoon(items as any)).toHaveLength(0);
  });
});
