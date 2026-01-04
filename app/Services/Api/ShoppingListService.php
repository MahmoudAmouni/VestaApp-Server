<?php

namespace App\Services\Api;

use App\Exceptions\ApiException;
use App\Models\Home;
use App\Models\PantryItemName;
use App\Models\ShoppingListItem;
use App\Models\Unit;
use App\Traits\FindOrCreateByName;
use Illuminate\Support\Facades\DB;

class ShoppingListService
{
    use FindOrCreateByName;

    public function list(int $homeId): array
    {
        $home = Home::query()->find($homeId);
        if (!$home) {
            throw ApiException::notFound('Home not found.');
        }

        

        $items = ShoppingListItem::query()
            ->where('home_id', $homeId)
            ->with(['unit', 'itemName'])
            ->orderBy('is_checked')
            ->orderByDesc('id')
            ->get();

        return ['shopping_list_items' => $items];
    }

    public function create(int $homeId, array $data): array
    {
        $home = Home::query()->find($homeId);
        if (!$home) {
            throw ApiException::notFound('Home not found.');
        }

        

        $shoppingItem = DB::transaction(function () use ($homeId, $data) {
            $itemName = $this->findOrCreateByName(PantryItemName::class, trim($data['item_name']));
            $unit = $this->findOrCreateByName(Unit::class, trim($data['unit']));

            $shoppingItem = new ShoppingListItem();
            $shoppingItem->home_id = $homeId;
            $shoppingItem->item_id = $itemName->id;
            $shoppingItem->unit_id = $unit->id;
            $shoppingItem->quantity = (int) $data['quantity'];
            $shoppingItem->is_checked = (bool) ($data['is_checked'] ?? false);
            $shoppingItem->save();

            return $shoppingItem;
        });

        $shoppingItem->load(['unit', 'itemName']);

        return ['shopping_list_item' => $shoppingItem];
    }

    public function update(int $homeId, int $shoppingListItemId, array $data): array
    {
        $home = Home::query()->find($homeId);
        if (!$home) {
            throw ApiException::notFound('Home not found.');
        }

        

        $shoppingItem = ShoppingListItem::query()
            ->where('id', $shoppingListItemId)
            ->where('home_id', $homeId)
            ->first();

        if (!$shoppingItem) {
            throw ApiException::notFound('Shopping list item not found in this home.');
        }

        DB::transaction(function () use ($shoppingItem, $data) {
            $itemName = $this->findOrCreateByName(PantryItemName::class, trim($data['item_name']));
            $unit = $this->findOrCreateByName(Unit::class, trim($data['unit']));

            $shoppingItem->item_id = $itemName->id;
            $shoppingItem->unit_id = $unit->id;
            $shoppingItem->quantity = (int) $data['quantity'];
            $shoppingItem->is_checked = (bool) ($data['is_checked'] ?? $shoppingItem->is_checked);
            $shoppingItem->save();
        });

        $shoppingItem->load(['unit', 'itemName']);

        return ['shopping_list_item' => $shoppingItem];
    }

    public function delete(int $homeId, int $shoppingListItemId): array
    {
        $home = Home::query()->find($homeId);
        if (!$home) {
            throw ApiException::notFound('Home not found.');
        }

        

        $shoppingItem = ShoppingListItem::query()
            ->where('id', $shoppingListItemId)
            ->where('home_id', $homeId)
            ->first();

        if (!$shoppingItem) {
            throw ApiException::notFound('Shopping list item not found in this home.');
        }

        DB::transaction(function () use ($shoppingItem) {
            $shoppingItem->delete();
        });

        return ['deleted' => true];
    }
}
