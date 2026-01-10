<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Ai\AiChatController;
use App\Http\Controllers\Api\DeviceController;
use App\Http\Controllers\Api\HomeController;
use App\Http\Controllers\Api\PantryController;
use App\Http\Controllers\Api\RoomsController;
use App\Http\Controllers\Api\ShoppingListController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;


//add versions to the routes 
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::group(["prefix" => "v1", "middleware" => "auth:api"], function () {
    Route::post('/home', [HomeController::class, 'create']);          
    Route::post('/home/{home}', [HomeController::class, 'update']);    
    Route::get('/home/{home}', [HomeController::class, 'delete']);

    Route::get('/pantry/{home_id}', [PantryController::class, 'list']);
    Route::post('/pantry/{home_id}', [PantryController::class, 'create']);
    Route::post('/pantry/{home_id}/{pantryItem}', [PantryController::class, 'update']);
    Route::get('/pantry/{home_id}/{pantryItem}', [PantryController::class, 'delete']);
    Route::get('/rooms/{home_id}', [RoomsController::class, 'listRoomsWithDevices']);
    Route::post('/rooms/create/{home_id}', [RoomsController::class, 'create']);
    Route::post('/devices/create/{home_id}/{room_id}', [DeviceController::class, 'create']);

    Route::get('/rooms/delete/{home_id}/{room_id}', [RoomsController::class, 'delete']);
    Route::get('/devices/delete/{home_id}/{room_id}/{device_id}', [DeviceController::class, 'delete']);

    Route::post('/rooms/{home_id}/{room_id}', [RoomsController::class, 'update']);
    Route::post('/devices/update/{home_id}/{room_id}/{device_id}', [DeviceController::class, 'update']);



    Route::get('/shoppinglist/{home_id}', [ShoppingListController::class, 'list']);
    Route::post('/shoppinglist/{home_id}', [ShoppingListController::class, 'create']);
    Route::post('/shoppinglist/{home_id}/{item_id}', [ShoppingListController::class, 'update']);
    Route::get('/shoppinglist/{home_id}/{item_id}', [ShoppingListController::class, 'delete']);

    Route::get('/chat/{home_id}', [ChatController::class, 'list']);

    Route::post('messages/{home}', [AiChatController::class, 'sendMessage']);

    Route::post('/users', [UserController::class, 'update']);
});

