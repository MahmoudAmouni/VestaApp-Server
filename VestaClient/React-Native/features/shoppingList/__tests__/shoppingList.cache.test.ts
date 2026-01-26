import { getShoppingListItemFromCache } from '../shoppingList.cache';
import { queryClient } from '@/lib/reactQuery';
import { shoppingListKey } from '@/hooks/shoppingList/useShoppingListQuery';

jest.mock('@/lib/reactQuery', () => ({
  queryClient: {
    getQueryData: jest.fn(),
  },
}));

jest.mock('@/hooks/shoppingList/useShoppingListQuery', () => ({
  shoppingListKey: jest.fn((homeId) => ['shoppingList', homeId]),
}));

describe('getShoppingListItemFromCache', () => {
  const mockItems = [
    { id: 1, name: 'Milk', checked: false, home: 1 },
    { id: 2, name: 'Bread', checked: true, home: 1 },
    { id: 3, name: 'Eggs', checked: false, home: 1 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns the item if it exists in the cache', () => {
    (queryClient.getQueryData as jest.Mock).mockReturnValue(mockItems);

    const result = getShoppingListItemFromCache(1, 2); // Look for Bread (id: 2)
    
    expect(shoppingListKey).toHaveBeenCalledWith(1);
    expect(queryClient.getQueryData).toHaveBeenCalledWith(['shoppingList', 1]);
    expect(result).toEqual(mockItems[1]);
  });

  test('returns undefined if the item is not in the cache', () => {
    (queryClient.getQueryData as jest.Mock).mockReturnValue(mockItems);

    const result = getShoppingListItemFromCache(1, 999); // Non-existent ID
    
    expect(result).toBeUndefined();
  });

  test('returns undefined if the cache is empty', () => {
    (queryClient.getQueryData as jest.Mock).mockReturnValue([]);

    const result = getShoppingListItemFromCache(1, 1);
    
    expect(result).toBeUndefined();
  });

  test('returns undefined if the cache is null/undefined', () => {
    (queryClient.getQueryData as jest.Mock).mockReturnValue(undefined);

    const result = getShoppingListItemFromCache(1, 1);
    
    expect(result).toBeUndefined();
  });
});
