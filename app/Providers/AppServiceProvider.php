<?php

namespace App\Providers;

use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Ensure SQL Server interprets ISO date strings regardless of locale.
        if (Config::get('database.default') !== 'sqlsrv') {
            return;
        }

        $this->configureSqlServerSession();
    }

    private function configureSqlServerSession(): void
    {
        try {
            $connection = DB::connection();

            if ($connection->getDriverName() !== 'sqlsrv') {
                return;
            }

            $connection->statement('SET DATEFORMAT ymd');
        } catch (\Throwable $exception) {
            report($exception);
        }
    }
}
