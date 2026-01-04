<?php

namespace App\Services\Api;

use App\Exceptions\ApiException;
use App\Models\Home;
use App\Models\PantryEvent;
use App\Models\PantryItem;
use App\Models\PantryItemName;
use App\Models\PantryLocation;
use App\Models\Unit;
use App\Traits\FindOrCreateByName;
use Illuminate\Support\Facades\DB;

class PantryService
{
    use FindOrCreateByName;

    public function list(int $homeId): array
    {
        $home = Home::query()->find($homeId);
        if (!$home) {
            throw ApiException::notFound('Home not found.');
        }


        $items = PantryItem::query()
            ->where('home_id', $homeId)
            ->with(['itemName', 'location', 'unit'])
            ->orderByRaw("expiry_date IS NULL, expiry_date ASC")
            ->orderByDesc('id')
            ->get();

        return ['pantry_items' => $items];
    }

    public function create(int $homeId, array $data): array
    {
        $home = Home::query()->find($homeId);
        if (!$home) {
            throw ApiException::notFound('Home not found.');
        }


        $pantryItem = DB::transaction(function () use ($homeId, $data) {
            $itemName = $this->findOrCreateByName(PantryItemName::class, trim($data['item_name']));
            $location = $this->findOrCreateByName(PantryLocation::class, trim($data['location']));
            $unit = $this->findOrCreateByName(Unit::class, trim($data['unit']));

            $pantryItem = new PantryItem();
            $pantryItem->home_id = $homeId;
            $pantryItem->owner_user_id = auth()->id(); 
            $pantryItem->item_name_id = $itemName->id;
            $pantryItem->location_id = $location->id;
            $pantryItem->unit_id = $unit->id;
            $pantryItem->quantity = (int) $data['quantity'];
            $pantryItem->expiry_date = $data['expiry_date'] ?? null;
            $pantryItem->save();

            $event = new PantryEvent();
            $event->home_id = $homeId;
            $event->$homeId = $pantryItem->id;
            $event->event_type = 'created (qty: ' . (int) $pantryItem->quantity . ')';
            $event->save();


            return $pantryItem;
        });

        $pantryItem->load(['itemName', 'location', 'unit']);

        return ['pantry_item' => $pantryItem];
    }

    public function update(int $homeId, int $pantryItemId, array $data): array
    {
        $home = Home::query()->find($homeId);
        if (!$home) {
            throw ApiException::notFound('Home not found.');
        }


        $pantryItem = PantryItem::query()
            ->where('id', $pantryItemId)
            ->where('home_id', $homeId)
            ->first();

        if (!$pantryItem) {
            throw ApiException::notFound('Pantry item not found in this home.');
        }
        $oldQty = (int) $pantryItem->quantity;
        DB::transaction(function () use ($homeId, $pantryItem, $data, $oldQty) {
            $itemName = $this->findOrCreateByName(PantryItemName::class, trim($data['item_name']));
            $location = $this->findOrCreateByName(PantryLocation::class, trim($data['location']));
            $unit = $this->findOrCreateByName(Unit::class, trim($data['unit']));

            $pantryItem->item_name_id = $itemName->id;
            $pantryItem->location_id = $location->id;
            $pantryItem->unit_id = $unit->id;
            $pantryItem->quantity = (int) $data['quantity'];
            $pantryItem->expiry_date = $data['expiry_date'] ?? null;
            $pantryItem->save();

            $newQty = (int) $pantryItem->quantity;
            $delta = $newQty - $oldQty;

            if ($delta > 0) {
                $eventType = 'qty_added: ' . $delta . ' (from ' . $oldQty . ' to ' . $newQty . ')';
            } elseif ($delta < 0) {
                $eventType = 'qty_removed: ' . abs($delta) . ' (from ' . $oldQty . ' to ' . $newQty . ')';
            } else {
                $eventType = 'updated (qty unchanged: ' . $oldQty . ')';
            }

            $event = new PantryEvent();
            $event->home_id = $homeId;
            $event->pantry_item_id = $pantryItem->id;
            $event->event_type = $eventType;
            $event->save();
        });

        $pantryItem->load(['itemName', 'location', 'unit']);

        return ['pantry_item' => $pantryItem];
    }

    public function delete(int $homeId, int $pantryItemId): array
    {
        $home = Home::query()->find($homeId);
        if (!$home) {
            throw ApiException::notFound('Home not found.');
        }


        $pantryItem = PantryItem::query()
            ->where('id', $pantryItemId)
            ->where('home_id', $homeId)
            ->first();

        if (!$pantryItem) {
            throw ApiException::notFound('Pantry item not found in this home.');
        }

        DB::transaction(function () use ($homeId, $pantryItem) {
            $event = new PantryEvent();
            $event->home_id = $homeId;
            $event->pantry_item_id = $pantryItem->id;
            $event->event_type = 'deleted (qty: ' . (int) $pantryItem->quantity . ')';
            $event->save();

            $pantryItem->delete(); 
        });

        return ['deleted' => true];
    }

}
