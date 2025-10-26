import { Head, Link, usePage, router } from '@inertiajs/react';
import type { PageProps } from '@inertiajs/core';
import { useState, useMemo } from 'react';
import type { ReactNode } from 'react';

// === Iconos y Componentes UI (Simulando Radix/Shadcn-ui) ===
import { Star, Clock, MapPin, Phone, Search, Plus, Minus, ShoppingCart, ArrowLeft, ChefHat } from "lucide-react";
import AppNavbar from '@/components/app-navbar';
import AppFooter from '@/components/app-footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


// === Tipos de Datos (Ajustados al Stack/BD) ===

interface Restaurant {
  id: number;
  business_name: string; // Corresponde a 'name' en el archivo fuente
  description?: string | null;
  logo_url?: string | null; // Corresponde a 'imageUrl' o similar
  minimum_order?: number | null;
  food_type?: string | null; // Corresponde a 'cuisineType'
  phone?: string | null;
  location_city?: string | null; // Para mostrar ubicación
  delivery_fee?: number | null; // Corresponde a 'deliveryFee'
  delivery_radius?: number | null; // Corresponde a 'deliveryRadius'
  rating?: number | null; // Corresponde a 'rating'
}

interface Dish {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  is_available: boolean; // Corresponde a 'isAvailable'
  image_url: string | null; // Corresponde a 'imageUrl'
  preparation_time: number; // Corresponde a 'preparationTime' (en minutos)
  calories: number;
  allergens: string | null;
}

interface CartItem {
  dish: Dish;
  quantity: number;
}

// === Props de la Página Inertia ===
interface RestaurantMenuProps extends PageProps {
    restaurant: Restaurant;
    dishes: Dish[];
}


// === Componente Principal ===
export default function RestaurantMenu() {
  // === CORRECCIÓN APLICADA: Proporcionar un array vacío como fallback para 'dishes' ===
  const { restaurant, dishes = [] } = usePage<RestaurantMenuProps>().props;

  // === Lógica de Estado (Del Archivo Fuente) ===
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState<CartItem[]>([]);

  // NOTA: 'dishes' ahora está garantizado como array, por lo que '.map' es seguro.
  const categories = useMemo(() => ["all", ...new Set(dishes.map((d) => d.category))], [dishes]);

  const filteredDishes = useMemo(() => {
    return dishes.filter((dish) => {
      const matchesSearch = dish.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || dish.category === selectedCategory;
      // Usando 'is_available' del tipo Dish
      return matchesSearch && matchesCategory && dish.is_available;
    });
  }, [dishes, searchTerm, selectedCategory]);

  const addToCart = (dish: Dish) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.dish.id === dish.id);
      if (existingItem) {
        return prev.map((item) => (item.dish.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...prev, { dish, quantity: 1 }];
    });
  };

  const removeFromCart = (dishId: number) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.dish.id === dishId);
      if (existingItem && existingItem.quantity > 1) {
        return prev.map((item) => (item.dish.id === dishId ? { ...item, quantity: item.quantity - 1 } : item));
      }
      return prev.filter((item) => item.dish.id !== dishId);
    });
  };

  const getCartItemQuantity = (dishId: number) => {
    const item = cart.find((item) => item.dish.id === dishId);
    return item ? item.quantity : 0;
  };

  const minimumOrder = typeof restaurant.minimum_order === "number" ? restaurant.minimum_order : 0;
  const deliveryFee = typeof restaurant.delivery_fee === "number" ? restaurant.delivery_fee : 0;
  const deliveryRadiusLabel = typeof restaurant.delivery_radius === "number" ? `${restaurant.delivery_radius} mi radius` : "Delivery radius unavailable";
  const restaurantPhone = restaurant.phone ?? "Phone unavailable";
  const restaurantFoodType = restaurant.food_type ?? "Restaurante";

  const cartTotal = cart.reduce((total, item) => total + item.dish.price * item.quantity, 0);
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleCheckout = () => {
    // Usando localStorage y router de Inertia (simulando next/navigation)
    localStorage.setItem("foodmarket_cart", JSON.stringify(cart));
    localStorage.setItem("foodmarket_checkout_restaurant", JSON.stringify(restaurant));
    // Asumimos que la ruta de checkout es '/checkout'
    router.get("/checkout");
  };

  const handleBack = () => {
    // Usando la navegación de Inertia
    window.history.back();
  };

  // === Renderizado (Estructura Visual del Archivo Fuente) ===
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 dark:bg-gray-950 dark:text-gray-200">
      <Head title={restaurant.business_name} />
      <AppNavbar />

      <main>
        {/* Restaurant Header */}
        <div className="bg-white border-b dark:bg-gray-900 dark:border-gray-800">
          <div className="container mx-auto px-4 py-6">
            {/* Botón de regreso usando la función de Inertia.js/history */}
            <Button variant="ghost" onClick={handleBack} className="mb-4 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Restaurants
            </Button>

            <div className="flex flex-col lg:flex-row gap-6">
              <div className="w-full lg:w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 dark:bg-gray-700">
                {restaurant.logo_url ? (
                    <img
                        src={restaurant.logo_url}
                        alt={restaurant.business_name}
                        className="w-full h-full object-cover rounded-lg"
                    />
                ) : (
                    <ChefHat className="h-16 w-16 text-gray-400" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2 dark:text-white">{restaurant.business_name}</h1>
                    <p className="text-gray-600 mb-3 dark:text-gray-400">{restaurant.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        {typeof restaurant.rating === "number" ? restaurant.rating.toFixed(1) : "New"}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        25-35 min
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {deliveryRadiusLabel}
                      </div>
                    </div>
                  </div>
                  {restaurantFoodType && (
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100">
                      {restaurantFoodType}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    {restaurantPhone}
                  </div>
                  <span>•</span>
                  <span>Min. order: ${minimumOrder.toFixed(2)}</span>
                  <span>•</span>
                  <span>Delivery: ${deliveryFee.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal: Menú y Carrito */}
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Menu Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Search and Filter */}
              <Card className="dark:bg-gray-900 dark:border-gray-800">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search menu items..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                      />
                    </div>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-full sm:w-48 dark:bg-gray-800 dark:text-white dark:border-gray-700">
                        <SelectValue placeholder="Filter by category" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                        {categories.map((category) => (
                          <SelectItem key={category} value={category} className="dark:text-white focus:dark:bg-gray-700">
                            {category === "all" ? "All Categories" : category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Menu Items por Categoría */}
              <div className="space-y-4">
                {categories
                  .filter((cat) => cat !== "all")
                  .map((category) => {
                    // Muestra solo las categorías que tienen platos visibles
                    const categoryDishes = filteredDishes.filter((dish) => dish.category === category);
                    if (categoryDishes.length === 0) return null;

                    return (
                      <Card key={category} className="dark:bg-gray-900 dark:border-gray-800">
                        <CardHeader>
                          <CardTitle className="text-xl dark:text-white">{category}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {categoryDishes.map((dish) => (
                            <div key={dish.id} className="flex items-start gap-4 p-4 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700">
                              {/* Imagen del Plato */}
                              <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 dark:bg-gray-700">
                                {dish.image_url ? (
                                  <img
                                    src={dish.image_url}
                                    alt={dish.name}
                                    className="w-full h-full object-cover rounded-lg"
                                  />
                                ) : (
                                  <ChefHat className="h-8 w-8 text-gray-400" />
                                )}
                              </div>

                              {/* Detalles del Plato */}
                              <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                  <h3 className="font-semibold text-lg dark:text-white">{dish.name}</h3>
                                  <span className="text-lg font-bold text-orange-600">${dish.price.toFixed(2)}</span>
                                </div>
                                <p className="text-gray-600 text-sm mb-2 dark:text-gray-400">{dish.description}</p>
                                <div className="flex items-center justify-between text-xs text-gray-500 mb-3 dark:text-gray-500">
                                  <span>{dish.preparation_time} min</span>
                                  <span>{dish.calories} cal</span>
                                  {dish.allergens && <span>Contains: {dish.allergens}</span>}
                                </div>

                                {/* Control de Cantidad / Agregar al Carrito */}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    {getCartItemQuantity(dish.id) > 0 ? (
                                      <>
                                        <Button variant="outline" size="sm" onClick={() => removeFromCart(dish.id)} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white hover:dark:bg-gray-600">
                                          <Minus className="h-3 w-3" />
                                        </Button>
                                        <span className="font-medium dark:text-white">{getCartItemQuantity(dish.id)}</span>
                                        <Button variant="outline" size="sm" onClick={() => addToCart(dish)} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white hover:dark:bg-gray-600">
                                          <Plus className="h-3 w-3" />
                                        </Button>
                                      </>
                                    ) : (
                                      <Button
                                        onClick={() => addToCart(dish)}
                                        size="sm"
                                        className="bg-orange-500 hover:bg-orange-600 text-white"
                                      >
                                        <Plus className="h-3 w-3 mr-1" />
                                        Add to Cart
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            </div>

            {/* Cart Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6 dark:bg-gray-900 dark:border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 dark:text-white">
                    <ShoppingCart className="h-5 w-5" />
                    Your Order ({cartItemCount})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {cart.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 dark:text-gray-400">Your cart is empty</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">Add items to get started</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Items del Carrito */}
                      {cart.map((item) => (
                        <div key={item.dish.id} className="flex items-center justify-between dark:text-white">
                          <div className="flex-1">
                            <h4 className="font-medium">{item.dish.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">${item.dish.price.toFixed(2)} each</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" onClick={() => removeFromCart(item.dish.id)} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white hover:dark:bg-gray-600">
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="font-medium">{item.quantity}</span>
                            <Button variant="outline" size="sm" onClick={() => addToCart(item.dish)} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white hover:dark:bg-gray-600">
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}

                      {/* Totales */}
                      <div className="border-t pt-4 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-2">
                          <span>Subtotal:</span>
                          <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span>Delivery:</span>
                          <span>${deliveryFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center font-bold text-lg border-t pt-2 dark:border-gray-700">
                          <span>Total:</span>
                          <span>${(cartTotal + deliveryFee).toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Botón de Checkout */}
                      <Button
                        onClick={handleCheckout}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                        disabled={cartTotal < minimumOrder}
                      >
                        {cartTotal < minimumOrder
                          ? `Min. order $${minimumOrder.toFixed(2)}`
                          : "Proceed to Checkout"}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}