-- Tabla users
INSERT INTO users (email, password, user_type, email_verified_at) VALUES
('cliente1@correo.com','pwd1','customer',NULL),
('cliente2@correo.com','pwd2','customer',NULL),
('rest1@correo.com','pwd3','restaurant',GETDATE()),
('admin@correo.com','pwd4','admin',GETDATE()),
('rest2@correo.com','pwd5','restaurant',GETDATE());

-- Tabla sessions
INSERT INTO sessions (id, user_id, ip_address, user_agent, payload, last_activity) VALUES
('sess1', 1, '192.168.1.1', 'Mozilla/5.0', 'payload1', 1696548211),
('sess2', 2, '192.168.1.2', 'Chrome/110', 'payload2', 1696548212),
('sess3', 3, '172.16.0.3', 'Safari/13', 'payload3', 1696548213),
('sess4', 4, '172.16.0.4', 'Edge/100', 'payload4', 1696548214),
('sess5', NULL, '10.0.0.5', 'Mozilla/4.0', 'payload5', 1696548215);

-- Tabla customers
INSERT INTO customers (user_id, first_name, last_name, phone, birth_date) VALUES
(1, 'Juan', 'Pérez', '5512345678', '1990-05-01'),
(2, 'Ana', 'García', '5522345678', '1985-09-21'),
(4, 'Mario', 'Robles', NULL, NULL),
(5, 'Lucía', 'Lopez', '5533345678', '2000-07-14'),
(3, 'Otro', 'Cliente', NULL, NULL);

-- Tabla restaurants
INSERT INTO restaurants (user_id, business_name, legal_name, phone) VALUES
(1, 'Taquería México', 'Taquería México S.A. de C.V.', '5598765432'),
(2, 'Pizzería Luigi', 'Luigi Pizza', '5598761234'),
(3, 'Tortas Jimmy', NULL, '5588451122'),
(4, 'Sushi House', NULL, '5544789000'),
(5, 'Bar El Pintor', NULL, '5598877665');

-- Tabla addresses
INSERT INTO addresses (user_id, address_line_1, latitude, longitude) VALUES
(1, 'Av. Reforma 123', 19.432607, -99.133209),
(2, 'Calle 16 de Sept 200', 19.426093, -99.167663),
(4, 'Av. Insurgentes 400', 19.380846, -99.180493),
(5, 'Prol. Canal 1', 19.304066, -99.082178),
(3, 'Colonia Centro', 19.433333, -99.133333);


-- Tabla dishes
INSERT INTO dishes (restaurant_id, name, price, category, preparation_time) VALUES
(4, 'Tacos al pastor', 35.00, 'Tacos', 10),
(5, 'Quesadilla', 25.00, 'Antojitos', 7),
(6, 'Pizza Margarita', 140.00, 'Pizza', 20),
(7, 'Lasagna', 120.00, 'Pastas', 30),
(8, 'Sushi roll', 89.00, 'Sushi', 12);

-- Tabla ingredients
INSERT INTO ingredients (restaurant_id, name, unit_measure, current_stock, min_stock_alert) VALUES
(4, 'Carne de cerdo', 'kg', 5.000, 1.000),
(5, 'Queso mozzarella', 'kg', 2.500, 0.500),
(6, 'Tortillas', 'cien piezas', 10.000, 2.000),
(7, 'Jitomate', 'kg', 3.000, 1.000),
(8, 'Arroz para sushi', 'kg', 8.000, 2.000);

-- Tabla dish_ingredients
INSERT INTO dish_ingredients (dish_id, ingredient_id, quantity_needed) VALUES
(3, 3, 0.150),
(4, 4, 0.200),
(5, 5, 0.120),
(6, 6, 0.180),
(7, 7, 0.200);

-- Tabla combos
INSERT INTO combos (restaurant_id, name, combo_price) VALUES
(4, 'Combo Pastor', 80.00),
(5, 'Combo Italiano', 200.00),
(6, 'Combo Sushi Party', 160.00),
(7, 'Combo Piccolo', 135.00),
(8, 'Combo Antojitos', 65.00);

-- Tabla combo_dishes
INSERT INTO combo_dishes (combo_id, dish_id, quantity) VALUES
(3, 3, 2),
(4, 4, 3),
(5, 5, 1),
(6, 6, 2),
(7, 7, 1);


-- Tabla promotions
INSERT INTO promotions (restaurant_id, name, promotion_type, discount_value, applies_to, valid_from, valid_until) VALUES
(4, 'Martes loco', 'percentage', 10.0, 'all', '2025-09-01', '2025-09-30'),
(5, '2x1 Pizza', 'buyxgety', 140.0, 'specificdishes','2025-10-01','2025-10-31'),
(6, 'Sushi Lovers', 'percentage', 15.0, 'category', '2025-08-15', '2025-09-15'),
(7, 'Pizza fest', 'fixedamount', 40.0, 'all', '2025-01-01', '2025-03-30'),
(8, 'Tacos viernes', 'fixedamount', 5.0, 'category', '2025-10-01', '2025-10-30');

-- Tabla orders
INSERT INTO orders (order_number, customer_id, restaurant_id, order_type, status, subtotal, total_amount, payment_method, payment_status, created_at, updated_at) VALUES
('ORD001', 11, 4, 'delivery', 'pending', 90.00, 100.00, 'card', 'pending', GETDATE(), GETDATE()),
('ORD002', 12, 5, 'pickup', 'confirmed', 150.00, 160.00, 'cash', 'paid', GETDATE(), GETDATE()),
('ORD003', 13, 6, 'delivery', 'completed', 120.00, 130.00, 'card', 'paid', GETDATE(), GETDATE()),
('ORD004', 14, 7, 'pickup', 'pending', 89.00, 100.00, 'cash', 'pending', GETDATE(), GETDATE()),
('ORD005', 15, 8, 'delivery', 'pending', 200.00, 220.00, 'card', 'pending', GETDATE(), GETDATE());

-- Tabla order_items
INSERT INTO order_items (order_id, item_type, dish_id, combo_id, quantity, unit_price, total_price) VALUES
(3, 'dish', 3, NULL, 2, 35.00, 70.00),
(4, 'dish', 4, NULL, 1, 25.00, 25.00),
(5, 'combo', NULL, 3, 1, 150.00, 150.00),
(6, 'dish', 6, NULL, 1, 120.00, 120.00),
(7, 'dish', 7, NULL, 1, 89.00, 89.00);
