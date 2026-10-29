<?php

use Illuminate\Support\Facades\Route;

Route::view('/', 'welcome', [
    'links' => [
        'beranda' => 'Beranda',
        'jelajahi' => 'Jelajahi',
       
    ],
]);
