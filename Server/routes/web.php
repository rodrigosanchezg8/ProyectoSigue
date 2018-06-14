<?php

use App\Http\Requests;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get("/", function () {
    return view("welcome");
});

Route::post("login", "AuthenticateController@authenticate")->name("login");
Route::post("godfathers/sign-up", "GodfatherController@store");
Route::post('godfathers/{user}/upload-profile-image', 'GodfatherController@uploadProfileImage');

Route::middleware(["jwt.auth"])->group(function () {

    Route::get('godfathers', 'UserController@index');
    Route::get('godfathers/{user}', 'GodfatherController@show');
    Route::post('godfathers', 'GodfatherController@store');
    Route::post('godfathers/{user}/godson/{godson}', 'GodfatherController@toggleGodson');
    Route::put('godfathers/{user}', 'GodfatherController@update');
    Route::delete('godfathers/{user}', 'GodfatherController@destroy');
    Route::get('godfathers/{user}/godsons', 'GodfatherController@getGodsons');

    Route::get('godson/{godson}/godfathers', 'GodsonController@getGodfathers');
    Route::resource('godsons', 'GodsonController');
});