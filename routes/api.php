<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\RoomsController;
use Illuminate\Support\Facades\Route;


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/rooms/{home_id}', [RoomsController::class, 'listRoomsWithDevices']);

