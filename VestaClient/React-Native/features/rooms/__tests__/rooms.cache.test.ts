import { getRoomFromCache, getDeviceFromCache } from '../rooms.cache';
import { queryClient } from '@/lib/reactQuery';
import { roomsKey } from '@/hooks/rooms/useRoomsQuery';

jest.mock('@/lib/reactQuery', () => ({
  queryClient: {
    getQueryData: jest.fn(),
  },
}));

jest.mock('@/hooks/rooms/useRoomsQuery', () => ({
  roomsKey: jest.fn((homeId) => ['rooms', homeId]),
}));

describe('Rooms Cache Helpers', () => {
  const mockRooms = [
    {
      id: 1,
      name: 'Living Room',
      devices: [
        { id: 101, name: 'Lamp', type: 'light' },
        { id: 102, name: 'TV', type: 'tv' },
      ],
    },
    {
      id: 2,
      name: 'Kitchen',
      devices: [
        { id: 201, name: 'Fridge', type: 'appliance' },
      ],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getRoomFromCache', () => {
    test('returns the room if it exists in the cache', () => {
      (queryClient.getQueryData as jest.Mock).mockReturnValue(mockRooms);

      const result = getRoomFromCache(1, 1); 
      
      expect(roomsKey).toHaveBeenCalledWith(1);
      expect(queryClient.getQueryData).toHaveBeenCalledWith(['rooms', 1]);
      expect(result).toEqual(mockRooms[0]);
    });

    test('returns undefined if the room is not in the cache', () => {
      (queryClient.getQueryData as jest.Mock).mockReturnValue(mockRooms);

      const result = getRoomFromCache(1, 999);
      
      expect(result).toBeUndefined();
    });

    test('returns undefined if the cache is null/undefined', () => {
      (queryClient.getQueryData as jest.Mock).mockReturnValue(undefined);

      const result = getRoomFromCache(1, 1);
      
      expect(result).toBeUndefined();
    });
  });

  describe('getDeviceFromCache', () => {
    test('returns the device if it exists in a room', () => {
      (queryClient.getQueryData as jest.Mock).mockReturnValue(mockRooms);

      const result = getDeviceFromCache(1, 102); 
      
      expect(result).toEqual(mockRooms[0].devices[1]);
    });

    test('returns the device from another room', () => {
      (queryClient.getQueryData as jest.Mock).mockReturnValue(mockRooms);

      const result = getDeviceFromCache(1, 201);
      
      expect(result).toEqual(mockRooms[1].devices[0]);
    });

    test('returns undefined if the device is not found', () => {
      (queryClient.getQueryData as jest.Mock).mockReturnValue(mockRooms);

      const result = getDeviceFromCache(1, 999);
      
      expect(result).toBeUndefined();
    });

    test('returns undefined if the cache is null/undefined', () => {
      (queryClient.getQueryData as jest.Mock).mockReturnValue(undefined);

      const result = getDeviceFromCache(1, 101);
      
      expect(result).toBeUndefined();
    });
  });
});
