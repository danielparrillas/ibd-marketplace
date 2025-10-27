<?php

namespace App\Events;

class OrderCreated
{
    public function __construct(
        public readonly int $orderId,
        public readonly ?int $userId,
        public readonly ?string $sessionToken = null,
    ) {
    }

    public function owner(): array
    {
        return [
            'user_id' => $this->userId,
            'session_token' => $this->userId ? null : $this->sessionToken,
        ];
    }
}
