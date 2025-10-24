<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Restaurant;

class RestaurantProfileController extends Controller
{
public function edit()
    {
        $restaurant = Restaurant::where('user_id', Auth::id())->firstOrFail();

        return Inertia::render('restaurant/profile/profile', [
            'restaurant' => $restaurant,
        ]);
    }

    public function update(Request $request)
    {
        $restaurant = Restaurant::where('user_id', Auth::id())->firstOrFail();

        $validated = $request->validate([
            'responsible_name' => 'required|string|max:255',
            'business_name' => 'required|string|max:255',
            'legal_name' => 'nullable|string|max:255',
            'phone' => 'required|string|max:20',
            'legal_document' => 'nullable|string|max:100',
            'business_license' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            // Cambiamos a carga de archivo: input name="logo"
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:4096',
        ]);

        // Actualizar campos simples
        $restaurant->fill([
            'responsible_name' => $validated['responsible_name'],
            'business_name' => $validated['business_name'],
            'legal_name' => $validated['legal_name'] ?? null,
            'phone' => $validated['phone'],
            'legal_document' => $validated['legal_document'] ?? null,
            'business_license' => $validated['business_license'] ?? null,
            'description' => $validated['description'] ?? null,
        ]);

        // Manejo de logo (archivo)
        if ($request->hasFile('logo')) {
            $file = $request->file('logo');

            // Eliminar logo anterior si era un path relativo y existe
            if (!empty($restaurant->logo_url)) {
                // Si guardamos relativo (ej. logos/xxx.jpg) eliminar desde disco public
                $previousPath = ltrim($restaurant->logo_url, '/');
                if (str_starts_with($previousPath, 'storage/')) {
                    // Normalizar a ruta en disco (public) si almacenaron /storage/... anteriormente
                    $previousPath = str_replace('storage/', '', $previousPath);
                }
                if (Storage::disk('public')->exists($previousPath)) {
                    Storage::disk('public')->delete($previousPath);
                }
            }

            // Guardar nuevo archivo en disco public dentro de carpeta logos
            $storedPath = $file->store('logos', 'public'); // ej: logos/filename.jpg

            // Guardar en BD el path relativo (sin /storage prefijo)
            $restaurant->logo_url = $storedPath; // ej: logos/filename.jpg
        }

        $restaurant->save();

        return back()->with('success', 'Restaurant profile updated.');
    }
}
