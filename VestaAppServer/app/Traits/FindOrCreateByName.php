<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Model;

trait FindOrCreateByName
{

    protected function findOrCreateByName(string $modelClass, string $name): Model
    {
        $name = trim($name);

        $row = $modelClass::withTrashed()->where('name', $name)->first();

        if ($row) {
            if (method_exists($row, 'trashed') && $row->trashed()) {
                $row->restore();
            }
            return $row;
        }

        $new = new $modelClass();
        $new->name = $name;
        $new->save();

        return $new;
    }
}
