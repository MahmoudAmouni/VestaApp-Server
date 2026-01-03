<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Model;


trait FindOrCreateByName
{
    /**
     * @param class-string<Model> $modelClass
     */
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

        return $modelClass::create(['name' => $name]);
    }
}
