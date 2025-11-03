CREATE DATABASE foodmarketplace
GO
USE foodmarketplace
GO

-- Tabla: cache
CREATE TABLE [dbo].[cache](
	[key] [nvarchar](255) NOT NULL PRIMARY KEY,
	[value] [nvarchar](max) NOT NULL,
	[expiration] [int] NOT NULL
)
GO

-- Tabla: cache_locks
CREATE TABLE [dbo].[cache_locks](
	[key] [nvarchar](255) NOT NULL PRIMARY KEY,
	[owner] [nvarchar](255) NOT NULL,
	[expiration] [int] NOT NULL
)
GO

-- Tabla: failed_jobs
CREATE TABLE [dbo].[failed_jobs](
	[id] [bigint] IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[uuid] [nvarchar](255) NOT NULL UNIQUE,
	[connection] [nvarchar](max) NOT NULL,
	[queue] [nvarchar](max) NOT NULL,
	[payload] [nvarchar](max) NOT NULL,
	[exception] [nvarchar](max) NOT NULL,
	[failed_at] [datetime] NOT NULL DEFAULT (getdate())
)
GO

-- Tabla: job_batches
CREATE TABLE [dbo].[job_batches](
	[id] [nvarchar](255) NOT NULL PRIMARY KEY,
	[name] [nvarchar](255) NOT NULL,
	[total_jobs] [int] NOT NULL,
	[pending_jobs] [int] NOT NULL,
	[failed_jobs] [int] NOT NULL,
	[failed_job_ids] [nvarchar](max) NOT NULL,
	[options] [nvarchar](max) NULL,
	[cancelled_at] [int] NULL,
	[created_at] [int] NOT NULL,
	[finished_at] [int] NULL
)
GO

-- Tabla: jobs
CREATE TABLE [dbo].[jobs](
	[id] [bigint] IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[queue] [nvarchar](255) NOT NULL,
	[payload] [nvarchar](max) NOT NULL,
	[attempts] [tinyint] NOT NULL,
	[reserved_at] [int] NULL,
	[available_at] [int] NOT NULL,
	[created_at] [int] NOT NULL
)
GO

CREATE INDEX [jobs_queue_index] ON [dbo].[jobs]([queue])
GO

-- Tabla: migrations
CREATE TABLE [dbo].[migrations](
	[id] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[migration] [nvarchar](255) NOT NULL,
	[batch] [int] NOT NULL
)
GO

-- Tabla: password_reset_tokens
CREATE TABLE [dbo].[password_reset_tokens](
	[email] [nvarchar](255) NOT NULL PRIMARY KEY,
	[token] [nvarchar](255) NOT NULL,
	[created_at] [datetime] NULL
)
GO

-- Tabla: sessions
CREATE TABLE [dbo].[sessions](
	[id] [nvarchar](255) NOT NULL PRIMARY KEY,
	[user_id] bigint NULL,
	[ip_address] [nvarchar](45) NULL,
	[user_agent] [nvarchar](max) NULL,
	[payload] [nvarchar](max) NOT NULL,
	[last_activity] [int] NOT NULL
)
GO

CREATE INDEX [sessions_user_id_index] ON [dbo].[sessions]([user_id])
GO

CREATE INDEX [sessions_last_activity_index] ON [dbo].[sessions]([last_activity])
GO


-- Tabla: users
CREATE TABLE [dbo].[users](
	[id] bigint IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[name] [nvarchar](255) NOT NULL,
	[email] [nvarchar](255) NOT NULL UNIQUE,
    [user_type] VARCHAR(20) NOT NULL CHECK (user_type IN ('customer', 'restaurant', 'admin')),
	[email_verified_at] [datetime] NULL,
	[password] [nvarchar](255) NOT NULL,
	[remember_token] [nvarchar](100) NULL,
	[created_at] [datetime] NULL,
	[updated_at] [datetime] NULL,
	[two_factor_secret] [nvarchar](max) NULL,
	[two_factor_recovery_codes] [nvarchar](max) NULL,
	[two_factor_confirmed_at] [datetime] NULL
)
GO

-- Tabla customers
CREATE TABLE customers (
    id bigint IDENTITY(1,1) PRIMARY KEY,
    user_id bigint NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NULL,
    birth_date DATE NULL,
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME NOT NULL DEFAULT GETDATE()
);

-- Tabla restaurants
CREATE TABLE restaurants (
    id bigint IDENTITY(1,1) PRIMARY KEY,
    user_id bigint NOT NULL UNIQUE,
	responsible_name VARCHAR(255) NOT NULL,
    business_name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255) NULL,
    phone VARCHAR(20) NOT NULL,
    legal_document VARCHAR(100) NULL,
    business_license VARCHAR(100) NULL,
    description TEXT NULL,
    logo_url VARCHAR(500) NULL,
    is_approved BIT NOT NULL DEFAULT 0,
    approval_date DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME NOT NULL DEFAULT GETDATE()
);

-- Tabla addresses
CREATE TABLE addresses (
    id bigint IDENTITY(1,1) PRIMARY KEY,
    user_id bigint NOT NULL,
    address_line_1 VARCHAR(255) NOT NULL,
    address_line_2 VARCHAR(255) NULL,
    latitude DECIMAL(12,6) NULL,
    longitude DECIMAL(12,6) NULL,
    delivery_instructions TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME NOT NULL DEFAULT GETDATE()
);

-- Tabla dishes
CREATE TABLE dishes (
    id bigint IDENTITY(1,1) PRIMARY KEY,
    restaurant_id bigint NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    price DECIMAL(8,2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    image_url VARCHAR(500) NULL,
    preparation_time INT NOT NULL,
    is_available BIT NOT NULL DEFAULT 1,
    is_featured BIT NOT NULL DEFAULT 0,
    calories INT NULL,
    allergens TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME NOT NULL DEFAULT GETDATE()
);

-- Tabla ingredients
CREATE TABLE ingredients (
    id bigint IDENTITY(1,1) PRIMARY KEY,
    restaurant_id bigint NOT NULL,
    name VARCHAR(255) NOT NULL,
    unit_measure VARCHAR(50) NOT NULL,
    current_stock DECIMAL(10,3) NOT NULL DEFAULT 0,
    min_stock_alert DECIMAL(10,3) NOT NULL DEFAULT 0,
    unit_cost DECIMAL(8,2) NULL,
    supplier VARCHAR(255) NULL,
    expiration_date DATE NULL,
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME NOT NULL DEFAULT GETDATE()
);

-- Tabla dish_ingredients
CREATE TABLE dish_ingredients (
    id bigint IDENTITY(1,1) PRIMARY KEY,
    dish_id bigint NOT NULL,
    ingredient_id bigint NOT NULL,
    quantity_needed DECIMAL(10,3) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME NOT NULL DEFAULT GETDATE()
);

-- Tabla combos
CREATE TABLE combos (
    id bigint IDENTITY(1,1) PRIMARY KEY,
    restaurant_id bigint NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    combo_price DECIMAL(8,2) NOT NULL,
    image_url VARCHAR(500) NULL,
    is_available BIT NOT NULL DEFAULT 1,
    valid_from DATETIME NULL,
    valid_until DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME NOT NULL DEFAULT GETDATE()
);

-- Tabla combo_dishes
CREATE TABLE combo_dishes (
    id bigint IDENTITY(1,1) PRIMARY KEY,
    combo_id bigint NOT NULL,
    dish_id bigint NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME NOT NULL DEFAULT GETDATE()
);

-- Tabla promotions
CREATE TABLE promotions (
    id bigint IDENTITY(1,1) PRIMARY KEY,
    restaurant_id bigint NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    promotion_type VARCHAR(20) NOT NULL CHECK (promotion_type IN ('percentage', 'fixedamount', 'buyxgety')),
    discount_value DECIMAL(8,2) NOT NULL,
    min_order_amount DECIMAL(8,2) NULL,
    max_discount DECIMAL(8,2) NULL,
    applies_to VARCHAR(20) NOT NULL CHECK (applies_to IN ('all', 'category', 'specificdishes')),
    target_categories TEXT NULL,
    target_dish_ids TEXT NULL,
    valid_from DATETIME NOT NULL,
    valid_until DATETIME NOT NULL,
    is_active BIT NOT NULL DEFAULT 1,
    usage_limit INT NULL,
    usage_count INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME NOT NULL DEFAULT GETDATE()
);

-- Tabla orders
CREATE TABLE orders (
    id bigint IDENTITY(1,1) PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    customer_id bigint NOT NULL,
    restaurant_id bigint NOT NULL,
    delivery_address_id bigint NULL,
    order_type VARCHAR(20) NOT NULL CHECK (order_type IN ('delivery', 'pickup')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'confirmed', 'prepared', 'outfordelivery', 'completed', 'cancelled')),
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    delivery_fee DECIMAL(8,2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(8,2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(20) NOT NULL CHECK (payment_status IN ('pending', 'paid', 'failed')),
    payment_reference VARCHAR(255) NULL,
    estimated_delivery_time DATETIME NULL,
    actual_delivery_time DATETIME NULL,
    special_instructions TEXT NULL,
    customer_rating INT NULL,
    customer_review TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME NOT NULL DEFAULT GETDATE()
);

-- Tabla order_items
CREATE TABLE order_items (
    id bigint IDENTITY(1,1) PRIMARY KEY,
    order_id bigint NOT NULL,
    item_type VARCHAR(20) NOT NULL CHECK (item_type IN ('dish', 'combo')),
    dish_id bigint NULL,
    combo_id bigint NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(8,2) NOT NULL,
    total_price DECIMAL(8,2) NOT NULL,
    special_requests TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME NOT NULL DEFAULT GETDATE()
);

ALTER TABLE sessions ADD FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE customers ADD FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE restaurants ADD FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE addresses ADD FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE dishes ADD FOREIGN KEY (restaurant_id) REFERENCES restaurants(id);
ALTER TABLE ingredients ADD FOREIGN KEY (restaurant_id) REFERENCES restaurants(id);
ALTER TABLE dish_ingredients ADD FOREIGN KEY (dish_id) REFERENCES dishes(id);
ALTER TABLE dish_ingredients ADD FOREIGN KEY (ingredient_id) REFERENCES ingredients(id);
ALTER TABLE combos ADD FOREIGN KEY (restaurant_id) REFERENCES restaurants(id);
ALTER TABLE combo_dishes ADD FOREIGN KEY (combo_id) REFERENCES combos(id);
ALTER TABLE combo_dishes ADD FOREIGN KEY (dish_id) REFERENCES dishes(id);
ALTER TABLE promotions ADD FOREIGN KEY (restaurant_id) REFERENCES restaurants(id);
ALTER TABLE orders ADD FOREIGN KEY (customer_id) REFERENCES customers(id);
ALTER TABLE orders ADD FOREIGN KEY (restaurant_id) REFERENCES restaurants(id);
ALTER TABLE orders ADD FOREIGN KEY (delivery_address_id) REFERENCES addresses(id);
ALTER TABLE order_items ADD FOREIGN KEY (order_id) REFERENCES orders(id);
ALTER TABLE order_items ADD FOREIGN KEY (dish_id) REFERENCES dishes(id);
ALTER TABLE order_items ADD FOREIGN KEY (combo_id) REFERENCES combos(id);
GO
-- Vista our_successes
CREATE VIEW [dbo].[our_successes]
AS
SELECT pvt.restaurant [count_restautants]
	,pvt.customer [count_customers]
	,pvt.[order] [count_orders]
FROM (
	SELECT [user_type]
		,count([id]) [count]
	FROM [foodmarketplace].[dbo].[users]
	WHERE user_type IN (
			'restaurant'
			,'customer'
			)
	GROUP BY [user_type]
	
	UNION
	
	SELECT 'order'
		,Count([id])
	FROM [foodmarketplace].[dbo].[orders]
	) src
pivot(sum([count]) FOR user_type IN (
			[customer]
			,[restaurant]
			,[order]
			)) pvt
GO
-- Vista top_restaurant

CREATE VIEW [dbo].[top_restaurant]
AS
SELECT TOP 3 t0.[restaurant_id]
	,t1.[business_name]
	,t1.[legal_name]
	,t1.[phone]
	,t1.[logo_url]
	,COUNT(1) [Orders_Count]
FROM [foodmarketplace].[dbo].[orders] t0
JOIN [foodmarketplace].[dbo].[restaurants] t1 ON t0.restaurant_id = t1.id
GROUP BY t0.[restaurant_id]
	,t1.[business_name]
	,t1.[legal_name]
	,t1.[phone]
	,t1.[logo_url]
GO

-- Tabla de Carrito de Compras
CREATE TABLE cart_items (
    id BIGINT PRIMARY KEY IDENTITY(1,1),    
    -- IDENTIFICACIÓN DEL CLIENTE (user_id o session_token deben tener valor)
    [user_id] BIGINT NULL, 
    session_token NVARCHAR(255) NULL, -- Token para usuarios no autenticados    
    -- Relaciones de Negocio
    restaurant_id BIGINT NOT NULL,
    dish_id BIGINT NOT NULL,    
    -- Datos del Ítem
    quantity INT NOT NULL DEFAULT 1,
    options NVARCHAR(MAX) NULL, -- JSON para opciones de personalización    
    -- Timestamps
    created_at DATETIME2 NOT NULL,
    updated_at DATETIME2 NOT NULL,
    -- Claves Foráneas (FK)
    CONSTRAINT FK_CartItem_User FOREIGN KEY ([user_id]) REFERENCES users(id),
    CONSTRAINT FK_CartItem_Restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
    CONSTRAINT FK_CartItem_Dish FOREIGN KEY (dish_id) REFERENCES dishes(id),
    -- RESTRICCIÓN DE NEGOCIO CRÍTICA (SQL Server CHECK Constraint)
    -- Garantiza que cada ítem pertenezca a un usuario ó a una sesión, pero no a ambos a la vez, 
    -- y al menos a uno de los dos.
    CONSTRAINT CHK_CartItem_Owner CHECK (
        ([user_id] IS NOT NULL AND session_token IS NULL) OR 
        ([user_id] IS NULL AND session_token IS NOT NULL)
    ),
    -- Índice Único para el session_token (ayuda a la búsqueda de carritos de invitados)
    CONSTRAINT UQ_CartItem_SessionToken UNIQUE (session_token, dish_id)
);

-- Indices para búsquedas rápidas
CREATE INDEX IX_CartItems_UserId ON cart_items ([user_id]);
CREATE INDEX IX_CartItems_SessionToken ON cart_items (session_token);


--  Catálogo de Medios de Pago (payment_methods)
CREATE TABLE payment_methods (
    id INT PRIMARY KEY IDENTITY(1,1),    
    name NVARCHAR(100) NOT NULL UNIQUE,         
    code NVARCHAR(50) NOT NULL UNIQUE,          
    category NVARCHAR(50) NOT NULL,             
    is_active BIT NOT NULL DEFAULT 1,           
    supports_refunds BIT NOT NULL DEFAULT 1,    
    -- Timestamps
    created_at DATETIME2 NOT NULL,
    updated_at DATETIME2 NOT NULL
);
-- Índice para búsqueda rápida por categoría
CREATE INDEX ix_payment_methods_category ON payment_methods (category);

-- Encabezado de la Factura
CREATE TABLE invoices (
    invoice_id BIGINT PRIMARY KEY IDENTITY(1,1),    
    -- Relaciones (INT para coincidir con PKs externas)
    user_id BIGINT NOT NULL,
    restaurant_id BIGINT NOT NULL,    
    -- Datos de Auditoría y Financieros
    invoice_number NVARCHAR(50) NOT NULL UNIQUE, 
    invoice_date DATETIME NOT NULL,    
    sub_total DECIMAL(10, 2) NOT NULL,
    delivery_fee DECIMAL(10, 2) NOT NULL,
    tax_amount DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    total_amount DECIMAL(10, 2) NOT NULL,    
    -- Estado y Logística
    status NVARCHAR(20) NOT NULL, 
    shipping_address NVARCHAR(MAX) NOT NULL,    
    -- Timestamps
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    -- Claves Foráneas (FK)
    CONSTRAINT fk_invoice_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_invoice_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
);

-- Detalle de la Factura 
CREATE TABLE invoice_details (
    invoice_detail_id BIGINT PRIMARY KEY IDENTITY(1,1),    
    -- Relación (BIGINT para apuntar a invoices.invoice_id)
    invoice_id BIGINT NOT NULL,
    dish_id BIGINT NOT NULL, 
    -- Detalle del Producto (desnormalizado)
    dish_name NVARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL, 
    line_total DECIMAL(10, 2) NOT NULL, 
    options_json NVARCHAR(MAX) NULL, 
    
    -- Claves Foráneas (FK)
    CONSTRAINT fk_invoice_detail_invoice FOREIGN KEY (invoice_id) REFERENCES invoices(invoice_id),
    CONSTRAINT fk_invoice_detail_dish FOREIGN KEY (dish_id) REFERENCES dishes(id)
);

-- Índice para buscar los detalles de una factura rápidamente
CREATE INDEX ix_invoice_details_invoice_id ON invoice_details (invoice_id);

-- Líneas de Pago de Factura
CREATE TABLE invoice_payments (
    payment_id BIGINT PRIMARY KEY IDENTITY(1,1),
    
    -- Relación a la Factura
    invoice_id BIGINT NOT NULL,
    -- Relación a medios de pago
    payment_method_id INT NOT NULL,     
    -- Detalles del Pago
    payment_gateway NVARCHAR(50) NULL,    
    -- id pasarela de pagos. Debe ser NULL para pagos en Efectivo/Vouchers
    gateway_transaction_id NVARCHAR(255) NULL UNIQUE,     
    amount_paid DECIMAL(10, 2) NOT NULL,
    payment_status NVARCHAR(20) NOT NULL,
    paid_at DATETIME2 NOT NULL,    
    -- Claves Foráneas (FK)
    CONSTRAINT fk_invoice_payment_invoice FOREIGN KEY (invoice_id) 
        REFERENCES invoices(invoice_id),
        
    -- Nueva FK que relaciona la línea de pago con el catálogo maestro
    CONSTRAINT fk_invoice_payment_method FOREIGN KEY (payment_method_id) 
        REFERENCES payment_methods(id)
);

CREATE INDEX ix_invoice_payments_invoice_id ON invoice_payments (invoice_id);

-- Tabla de Descuento por Detalle de Factura (invoice_discounts - Relación 1:1)
CREATE TABLE invoice_discounts (
    -- La PK es la FK a invoice_details.invoice_detail_id (BIGINT)
    invoice_detail_id BIGINT PRIMARY KEY,    
    -- Detalles del Descuento
    discount_type NVARCHAR(50) NOT NULL,     -- Ej: 'Percentage', 'Fixed Amount', 'Coupon'
    discount_value DECIMAL(10, 2) NOT NULL,  -- El valor del descuento (ej: 10.00 si es 10% o $10.00)
    discount_rate DECIMAL(10, 4) NULL,       -- Si es porcentaje, almacena 0.10, si es fijo, NULL
    discount_amount DECIMAL(10, 2) NOT NULL, -- El monto real del descuento aplicado a la línea
    coupon_code NVARCHAR(50) NULL,           -- Código del cupón utilizado (si aplica)    
    -- Clave Foránea (FK)
    CONSTRAINT fk_invoice_discount_detail FOREIGN KEY (invoice_detail_id) 
        REFERENCES invoice_details(invoice_detail_id)
);
GO
--***************SP PARA VENTAS POR PLATILLOS (30 DIAS)*********************
CREATE PROCEDURE sp_sales_by_dish
    @userId bigint
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @restaurantId bigint;
    SELECT @restaurantId = id FROM restaurants WHERE user_id = @userId;

    SELECT
      d.id AS dish_id,
      d.name AS dish_name,
      SUM(oi.quantity) AS total_quantity
    FROM order_items oi
    LEFT JOIN dishes d ON oi.dish_id = d.id
    JOIN orders o ON oi.order_id = o.id
    WHERE o.status = 'completed'
      AND o.restaurant_id = @restaurantId
      AND o.created_at >= DATEADD(DAY, -30, GETDATE())
      AND oi.dish_id IS NOT NULL
    GROUP BY d.id, d.name

    UNION ALL

    SELECT
      d2.id AS dish_id,
      d2.name AS dish_name,
      SUM(oi.quantity * cd.quantity) AS total_quantity
    FROM order_items oi
    JOIN combos c ON oi.combo_id = c.id
    JOIN combo_dishes cd ON c.id = cd.combo_id
    JOIN dishes d2 ON cd.dish_id = d2.id
    JOIN orders o ON oi.order_id = o.id
    WHERE o.status = 'completed'
      AND o.restaurant_id = @restaurantId
      AND o.created_at >= DATEADD(DAY, -30, GETDATE())
      AND oi.combo_id IS NOT NULL
    GROUP BY d2.id, d2.name;
END
GO
--*************SP PARA BAJO STOCK*****************
CREATE PROCEDURE sp_low_inventory
    @userId bigint
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @restaurantId bigint;
    SELECT @restaurantId = id FROM restaurants WHERE user_id = @userId;

    SELECT TOP 5
        name,
        current_stock
    FROM ingredients
    WHERE restaurant_id = @restaurantId
    ORDER BY current_stock ASC;
END
GO

--**************SP PARA PEDIDOS EN LOS ULTIMOS 7 DIAS**************
CREATE PROCEDURE sp_orders_last_7_days
    @userId bigint
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @restaurantId bigint;
    SELECT @restaurantId = id FROM restaurants WHERE user_id = @userId;

    SELECT 
        CAST(created_at AS DATE) AS order_date,
        COUNT(*) AS order_count
    FROM orders
    WHERE status = 'completed'
      AND restaurant_id = @restaurantId
      AND created_at >= DATEADD(DAY, -7, CAST(GETDATE() AS DATE))
    GROUP BY CAST(created_at AS DATE)
    ORDER BY order_date;
END

GO
--**************SP VENTAS TOTALES ULTIMOS 7 DIAS******************
CREATE PROCEDURE sp_sales_total_last_7_days
    @userId bigint
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @restaurantId bigint;
    SELECT @restaurantId = id FROM restaurants WHERE user_id = @userId;

    SELECT 
        CAST(created_at AS DATE) AS sale_date,
        SUM(total_amount) AS total_sales
    FROM orders
    WHERE status = 'completed'
      AND restaurant_id = @restaurantId
      AND created_at >= DATEADD(DAY, -7, CAST(GETDATE() AS DATE))
    GROUP BY CAST(created_at AS DATE)
    ORDER BY sale_date;
END

GO
--*************COMBOS MAS VENDIDOS (30 DIAS)************
CREATE PROCEDURE sp_top_combos
    @userId bigint
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @restaurantId bigint;
    SELECT @restaurantId = id FROM restaurants WHERE user_id = @userId;

    SELECT TOP 5
        c.id AS combo_id,
        c.name AS combo_name,
        SUM(oi.quantity) AS total_quantity
    FROM order_items oi
    JOIN combos c ON oi.combo_id = c.id
    JOIN orders o ON oi.order_id = o.id
    WHERE o.status = 'completed'
      AND o.restaurant_id = @restaurantId
      AND o.created_at >= DATEADD(DAY, -30, GETDATE())
    GROUP BY c.id, c.name
    ORDER BY total_quantity DESC;
END
GO