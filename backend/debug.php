<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Lead;
$user = User::find(1);
Auth::login($user);

$req = Illuminate\Http\Request::create('/api/open_leads_by_user', 'GET');
$controller = app(App\Http\Controllers\Api\LeadsController::class);
echo "OPEN: " . json_encode($controller->getOpenLeadsByUser($req)->getData()) . "\n";

echo "UNTOUCHED: " . json_encode($controller->getUntouchedLeadsByUser($req)->getData()) . "\n";

echo "DONE ORDERS: " . json_encode($controller->getDoneOrdersByUser($req)->getData()) . "\n";
