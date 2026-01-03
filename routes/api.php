<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DeviceController;
use App\Http\Controllers\Api\RoomsController;
use Illuminate\Support\Facades\Route;


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/rooms/{home_id}', [RoomsController::class, 'listRoomsWithDevices']);
Route::post('/rooms/create/{home_id}', [RoomsController::class, 'create']);
Route::post('/devices/create/{home_id}/{room_id}', [DeviceController::class, 'create']);

