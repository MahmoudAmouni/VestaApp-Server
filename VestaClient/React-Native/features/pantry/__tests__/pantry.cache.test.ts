import { getPantryItemFromCache } from '../pantry.cache';
import { queryClient } from '@/lib/reactQuery';
import { pantryKey } from '@/hooks/pantry/usePantryQuery';

jest.mock('@/lib/reactQuery', () => ({
  queryClient: {
    getQueryData: jest.fn(),
  },
}));

jest.mock('@/hooks/pantry/usePantryQuery', () => ({
  pantryKey: jest.fn((homeId) => ['pantry', homeId]),
}));

describe('getPantryItemFromCache', () => {
  const mockPantryItems = [
    { id: 1, name: 'Apple', quantity: 5, home: 1 },
    { id: 2, name: 'Banana', quantity: 3, home: 1 },
    { id: 3, name: 'Milk', quantity: 1, home: 1 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns the item if it exists in the cache', () => {
    (queryClient.getQueryData as jest.Mock).mockReturnValue(mockPantryItems);

    const result = getPantryItemFromCache(1, 2); 
    
    expect(pantryKey).toHaveBeenCalledWith(1);
    expect(queryClient.getQueryData).toHaveBeenCalledWith(['pantry', 1]);
    expect(result).toEqual(mockPantryItems[1]);
  });

  test('returns undefined if the item is not in the cache', () => {
    (queryClient.getQueryData as jest.Mock).mockReturnValue(mockPantryItems);

    const result = getPantryItemFromCache(1, 999); 
    
    expect(result).toBeUndefined();
  });

  test('returns undefined if the cache is empty or null', () => {
    (queryClient.getQueryData as jest.Mock).mockReturnValue(undefined);

    const result = getPantryItemFromCache(1, 1);
    
    expect(result).toBeUndefined();
  });

  test('handles empty array in cache', () => {
    (queryClient.getQueryData as jest.Mock).mockReturnValue([]);

    const result = getPantryItemFromCache(1, 1);
    
    expect(result).toBeUndefined();
  });
});
