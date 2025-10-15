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
	[user_id] INT NULL,
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
	[id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
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
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NULL,
    birth_date DATE NULL,
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME NOT NULL DEFAULT GETDATE()
);

-- Tabla restaurants
CREATE TABLE restaurants (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
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
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    address_line_1 VARCHAR(255) NOT NULL,
    address_line_2 VARCHAR(255) NULL,
    latitude DECIMAL(12,6) NOT NULL,
    longitude DECIMAL(12,6) NOT NULL,
    delivery_instructions TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME NOT NULL DEFAULT GETDATE()
);

-- Tabla dishes
CREATE TABLE dishes (
    id INT IDENTITY(1,1) PRIMARY KEY,
    restaurant_id INT NOT NULL,
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
    id INT IDENTITY(1,1) PRIMARY KEY,
    restaurant_id INT NOT NULL,
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
    id INT IDENTITY(1,1) PRIMARY KEY,
    dish_id INT NOT NULL,
    ingredient_id INT NOT NULL,
    quantity_needed DECIMAL(10,3) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME NOT NULL DEFAULT GETDATE()
);

-- Tabla combos
CREATE TABLE combos (
    id INT IDENTITY(1,1) PRIMARY KEY,
    restaurant_id INT NOT NULL,
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
    id INT IDENTITY(1,1) PRIMARY KEY,
    combo_id INT NOT NULL,
    dish_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME NOT NULL DEFAULT GETDATE()
);

-- Tabla promotions
CREATE TABLE promotions (
    id INT IDENTITY(1,1) PRIMARY KEY,
    restaurant_id INT NOT NULL,
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
    id INT IDENTITY(1,1) PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    customer_id INT NOT NULL,
    restaurant_id INT NOT NULL,
    delivery_address_id INT NULL,
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
    id INT IDENTITY(1,1) PRIMARY KEY,
    order_id INT NOT NULL,
    item_type VARCHAR(20) NOT NULL CHECK (item_type IN ('dish', 'combo')),
    dish_id INT NULL,
    combo_id INT NULL,
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
