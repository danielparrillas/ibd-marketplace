<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('cart_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('session_token')->nullable()->index();
            $table->foreignId('dish_id')->constrained()->onDelete('cascade');
            $table->foreignId('restaurant_id')->constrained()->onDelete('cascade');
            $table->unsignedInteger('quantity');
            $table->json('options')->nullable();
            $table->timestamps();

            $table->foreign('dish_id')->references('id')->on('dishes')->onDelete('cascade');
            $table->foreign('restaurant_id')->references('id')->on('restaurants')->onDelete('cascade');

            // Define unique constraints
            $table->unique(['user_id', 'dish_id']);
            $table->unique(['session_token', 'dish_id']);

            // Constraint to ensure that either user_id or session_token is set, but not both.
            $table->check('("user_id" IS NOT NULL AND "session_token" IS NULL) OR ("user_id" IS NULL AND "session_token" IS NOT NULL)');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cart_items');
    }
};
