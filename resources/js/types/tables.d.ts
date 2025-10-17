// Tipos generados a partir del esquema de base de datos

export interface CacheTable {
    key: string;
    value: string;
    expiration: number;
}

export interface CacheLockTable {
    key: string;
    owner: string;
    expiration: number;
}

export interface FailedJobTable {
    id: number;
    uuid: string;
    connection: string;
    queue: string;
    payload: string;
    exception: string;
    failed_at: string;
}

export interface JobBatchTable {
    id: string;
    name: string;
    total_jobs: number;
    pending_jobs: number;
    failed_jobs: number;
    failed_job_ids: string;
    options: string | null;
    cancelled_at: number | null;
    created_at: number;
    finished_at: number | null;
}

export interface JobTable {
    id: number;
    queue: string;
    payload: string;
    attempts: number;
    reserved_at: number | null;
    available_at: number;
    created_at: number;
}

export interface MigrationTable {
    id: number;
    migration: string;
    batch: number;
}

export interface PasswordResetTokenTable {
    email: string;
    token: string;
    created_at: string | null;
}

export interface SessionTable {
    id: string;
    user_id: number | null;
    ip_address: string | null;
    user_agent: string | null;
    payload: string;
    last_activity: number;
}

export interface UserTable {
    id: number;
    name: string;
    email: string;
    user_type: 'customer' | 'restaurant' | 'admin';
    email_verified_at: string | null;
    password: string;
    remember_token: string | null;
    created_at: string | null;
    updated_at: string | null;
    two_factor_secret: string | null;
    two_factor_recovery_codes: string | null;
    two_factor_confirmed_at: string | null;
}

export interface CustomerTable {
    id: number;
    user_id: number;
    first_name: string;
    last_name: string;
    phone: string | null;
    birth_date: string | null;
    created_at: string;
    updated_at: string;
}

export interface RestaurantTable {
    id: number;
    user_id: number;
    responsible_name: string;
    business_name: string;
    legal_name: string | null;
    phone: string;
    legal_document: string | null;
    business_license: string | null;
    description: string | null;
    logo_url: string | null;
    is_approved: boolean;
    approval_date: string | null;
    created_at: string;
    updated_at: string;
}

export interface AddressTable {
    id: number;
    user_id: number;
    address_line_1: string;
    address_line_2: string | null;
    latitude: number;
    longitude: number;
    delivery_instructions: string | null;
    created_at: string;
    updated_at: string;
}

export interface DishTable {
    id: number;
    restaurant_id: number;
    name: string;
    description: string | null;
    price: number;
    category: string;
    image_url: string | null;
    preparation_time: number;
    is_available: boolean;
    is_featured: boolean;
    calories: number | null;
    allergens: string | null;
    created_at: string;
    updated_at: string;
}

export interface IngredientTable {
    id: number;
    restaurant_id: number;
    name: string;
    unit_measure: string;
    current_stock: number;
    min_stock_alert: number;
    unit_cost: number | null;
    supplier: string | null;
    expiration_date: string | null;
    created_at: string;
    updated_at: string;
}

export interface DishIngredientTable {
    id: number;
    dish_id: number;
    ingredient_id: number;
    quantity_needed: number;
    created_at: string;
    updated_at: string;
}

export interface ComboTable {
    id: number;
    restaurant_id: number;
    name: string;
    description: string | null;
    combo_price: number;
    image_url: string | null;
    is_available: boolean;
    valid_from: string | null;
    valid_until: string | null;
    created_at: string;
    updated_at: string;
}

export interface ComboDishTable {
    id: number;
    combo_id: number;
    dish_id: number;
    quantity: number;
    created_at: string;
    updated_at: string;
}

export interface PromotionTable {
    id: number;
    restaurant_id: number;
    name: string;
    description: string | null;
    promotion_type: 'percentage' | 'fixedamount' | 'buyxgety';
    discount_value: number;
    min_order_amount: number | null;
    max_discount: number | null;
    applies_to: 'all' | 'category' | 'specificdishes';
    target_categories: string | null;
    target_dish_ids: string | null;
    valid_from: string;
    valid_until: string;
    is_active: boolean;
    usage_limit: number | null;
    usage_count: number;
    created_at: string;
    updated_at: string;
}

export interface OrderTable {
    id: number;
    order_number: string;
    customer_id: number;
    restaurant_id: number;
    delivery_address_id: number | null;
    order_type: 'delivery' | 'pickup';
    status:
        | 'pending'
        | 'confirmed'
        | 'prepared'
        | 'outfordelivery'
        | 'completed'
        | 'cancelled';
    subtotal: number;
    tax_amount: number;
    delivery_fee: number;
    discount_amount: number;
    total_amount: number;
    payment_method: string;
    payment_status: 'pending' | 'paid' | 'failed';
    payment_reference: string | null;
    estimated_delivery_time: string | null;
    actual_delivery_time: string | null;
    special_instructions: string | null;
    customer_rating: number | null;
    customer_review: string | null;
    created_at: string;
    updated_at: string;
}

export interface OrderItemTable {
    id: number;
    order_id: number;
    item_type: 'dish' | 'combo';
    dish_id: number | null;
    combo_id: number | null;
    quantity: number;
    unit_price: number;
    total_price: number;
    special_requests: string | null;
    created_at: string;
    updated_at: string;
}
