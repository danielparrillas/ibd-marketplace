<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
{
    // Validar campos comunes
    $request->validate([
        'user_type' => 'required|string|in:customer,restaurant',
        'email' => 'required|string|email|max:255|unique:users,email',
        'password' => ['required', 'confirmed', Rules\Password::defaults()],
    ]);

    // Validaciones específicas según user_type
    if ($request->user_type === 'customer') {
        $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'phone' => 'nullable|string|max:20',
            'birth_date' => 'nullable|date',
        ]);
    }

    if ($request->user_type === 'restaurant') {
        $request->validate([
            'business_name' => 'required|string|max:255',
            'legal_name' => 'nullable|string|max:255',
            'phone' => 'required|string|max:20',
            'legal_document' => 'nullable|string|max:100',
            'business_license' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'logo_url' => 'nullable|url|max:500',
            'responsible_name' => 'required|string|max:255',
        ]);
    }

   /*  // Usar transacción para mantener integridad
    \DB::transaction(function () use ($request) {
        // Crear usuario base
        $user = User::create([
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'user_type' => $request->user_type,
        ]);

        // Crear perfil cliente o restaurante según user_type
        if ($request->user_type === 'customer') {
            $user->customer()->create([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'phone' => $request->phone,
                'birth_date' => $request->birth_date,
            ]);
        }

        if ($request->user_type === 'restaurant') {
            $user->restaurant()->create([
                'business_name' => $request->business_name,
                'legal_name' => $request->legal_name,
                'phone' => $request->phone,
                'legal_document' => $request->legal_document,
                'business_license' => $request->business_license,
                'description' => $request->description,
                'logo_url' => $request->logo_url,
                'responsible_name' => $request->responsible_name,
            ]);
        }

        // Evento de registro
        event(new Registered($user));

        // Login del usuario
        Auth::login($user);

        // Regenerar sesión
        $request->session()->regenerate();
    }); */
    // Crear usuario base con name
        \DB::transaction(function () use ($request) {
        // Determinar el nombre de usuario según el tipo
        $fullName = '';

        if ($request->user_type === 'customer') {
            $fullName = trim($request->first_name . ' ' . $request->last_name);
        } elseif ($request->user_type === 'restaurant') {
            $fullName = $request->responsible_name;
        }

        // Crear usuario con el campo name dinámico
        $user = User::create([
            'name' => $fullName,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'user_type' => $request->user_type,
        ]);

        // Crear perfil específico
        if ($request->user_type === 'customer') {
            $user->customer()->create([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'phone' => $request->phone,
                'birth_date' => $request->birth_date,
            ]);
        }

        if ($request->user_type === 'restaurant') {
            $user->restaurant()->create([
                'business_name' => $request->business_name,
                'legal_name' => $request->legal_name,
                'phone' => $request->phone,
                'legal_document' => $request->legal_document,
                'business_license' => $request->business_license,
                'description' => $request->description,
                'logo_url' => $request->logo_url,
                'responsible_name' => $request->responsible_name,
            ]);
        }

        event(new Registered($user));
        Auth::login($user);
        $request->session()->regenerate();
    });


    // Redireccionar al dashboard
    return redirect()->intended(route('dashboard', absolute: false));
}

}
