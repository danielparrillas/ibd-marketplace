<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Services\CartService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Fortify\Features;

class AuthenticatedSessionController extends Controller
{
    public function __construct(private readonly CartService $cartService)
    {
    }

    /**
     * Show the login page.
     */
    public function create(Request $request): Response
    {
        $intended = $request->query('intended');

        if (is_string($intended) && Str::startsWith($intended, '/')) {
            $request->session()->put('url.intended', $intended);
        } elseif (!$request->session()->has('url.intended')) {
            $referer = $request->headers->get('referer');
            $loginUrl = $request->fullUrl();
            $registerUrl = route('register');

            if (is_string($referer) && $referer !== '') {
                $base = URL::to('/');

                if (Str::startsWith($referer, $base)) {
                    $relative = '/' . ltrim(Str::after($referer, $base), '/');

                    if (!Str::startsWith($relative, ['/login', '/register']) && $referer !== $loginUrl && $referer !== $registerUrl) {
                        $request->session()->put('url.intended', $relative);
                    }
                }
            }
        }

        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
            'notice' => $request->query('message'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $user = $request->validateCredentials();

        if (Features::enabled(Features::twoFactorAuthentication()) && $user->hasEnabledTwoFactorAuthentication()) {
            $request->session()->put([
                'login.id' => $user->getKey(),
                'login.remember' => $request->boolean('remember'),
            ]);

            return to_route('two-factor.login');
        }

        Auth::login($user, $request->boolean('remember'));

        $sessionToken = (string) ($request->cookie('cart_token') ?? $request->input('session_token') ?? '');

        if ($sessionToken !== '') {
            $this->cartService->migrateSessionCartToUser($sessionToken, (int) $user->id);
            Cookie::queue(Cookie::forget('cart_token'));
        }

        $request->session()->regenerate();

        //return redirect()->intended(route('dashboard', absolute: false));
        return redirect()->intended($this->redirectTo());
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }

    //redirigir al dashboard segun el rol
    protected function redirectTo()
        {
            $user = auth()->user();

            if ($user->user_type === 'restaurant') {
                return '/restaurants/dashboard';
            }

            // Otros roles aquí
            return '/'; // Ruta por defecto para otros roles
        }

    
}
