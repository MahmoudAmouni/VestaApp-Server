<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Ai\AiChatController;
use App\Http\Controllers\Api\DeviceController;
use App\Http\Controllers\Api\HomeController;
use App\Http\Controllers\Api\PantryController;
use App\Http\Controllers\Api\RoomsController;
use App\Http\Controllers\Api\SavedRecipeController;
use App\Http\Controllers\Api\ShoppingListController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\EspController;
use App\Http\Controllers\Api\RagController;
use App\Http\Controllers\Api\VestaController;
use Illuminate\Support\Facades\Route;


//add versions to the routes 
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/auth/google', [AuthController::class, 'google']);


Route::group(["prefix" => "v1", "middleware" => "auth:api"], function () {
    Route::post('/home/{home}', [HomeController::class, 'update']);    
    Route::get('/home/{home}', [HomeController::class, 'delete']);



    Route::prefix('/pantry')->group(function () {
        Route::get('/{home_id}', [PantryController::class, 'list']);
        Route::post('/{home_id}', [PantryController::class, 'create']);
        Route::post('/{home_id}/{pantryItem}', [PantryController::class, 'update']);
        Route::get('/{home_id}/{pantryItem}', [PantryController::class, 'delete']);
    });

    
    
    Route::prefix('/room')->group(function () {
        Route::get('/{home_id}', [RoomsController::class, 'listRoomsWithDevices']);
        Route::post('/{home_id}', [RoomsController::class, 'create']);
        Route::post('/{home_id}/{room_id}', [RoomsController::class, 'update']);
        Route::get('/{home_id}/{room_id}', [RoomsController::class, 'delete']);
        Route::post('/{home_id}/{room_id}/on', [RoomsController::class, 'turnAllOn']);
        Route::post('/{home_id}/{room_id}/off', [RoomsController::class, 'turnAllOff']);
        });
        
        
    Route::prefix('/device')->group(function () {
        Route::get('/{home_id}/{room_id}/{device_id}', [DeviceController::class, 'delete']);
        Route::post('/{home_id}/{room_id}/{device_id}', [DeviceController::class, 'update']);
        Route::post('/{home_id}/{room_id}', [DeviceController::class, 'create']);
    });

    Route::prefix('/esp')->group(function () {
        Route::post('/on', [EspController::class, 'on']);
        Route::post('/off', [EspController::class, 'off']);
    });

    Route::prefix('/shoppinglist')->group(function () {
        Route::get('/{home_id}', [ShoppingListController::class, 'list']);
        Route::post('/{home_id}', [ShoppingListController::class, 'create']);
        Route::post('/{home_id}/{item_id}', [ShoppingListController::class, 'update']);
        Route::get('/{home_id}/checked', [ShoppingListController::class, 'clearChecked']);
    });


    Route::prefix('/savedrecipe')->group(function () {
        Route::get('/{home_id}', [SavedRecipeController::class, 'get']);
        Route::post('/{home_id}', [SavedRecipeController::class, 'create']);
        Route::get('/{home_id}/{recipe_name}', [SavedRecipeController::class, 'deleteByName']);
    });
        
    Route::get('/chat/{home_id}', [ChatController::class, 'list']);
    Route::post('messages/{home}', [AiChatController::class, 'sendMessage']);

    Route::post('/users', [UserController::class, 'update']);

    Route::prefix('/rag')->group(function () {
        Route::post('/search', [RagController::class, 'search']);
    });

    Route::prefix('/vesta')->group(function () {
        Route::post('/voice', [VestaController::class, 'voice']);
    });
});

