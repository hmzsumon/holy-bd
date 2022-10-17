-- create table user
CREATE TABLE users (
    user_id BIGSERIAL NOT NULL PRIMARY KEY,
    customer_id VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(255) NOT NULL,
    password VARCHAR(255),
    address VARCHAR(255),
    city VARCHAR(255),
    state VARCHAR(255),
    zip VARCHAR(255),
    country VARCHAR(255),
    avatar_url VARCHAR(255),
    avatar_public_id VARCHAR(255),
    gender VARCHAR(255),
    role VARCHAR(255) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- create table notices
CREATE TABLE notices (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


   
-- create table wallets
CREATE TABLE wallets (
    wallet_id BIGSERIAL NOT NULL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    currency VARCHAR(255) NOT NULL,
    wallet_company VARCHAR(255) NOT NULL,
    wallet_type VARCHAR(255) NOT NULL,
    min_amount INT,
    by_rate NUMERIC(20,2) NOT NULL,
    sell_rate NUMERIC(20,2) NOT NULL,
    is_send BOOLEAN DEFAULT TRUE,
    is_receive BOOLEAN DEFAULT TRUE,
    reserve NUMERIC(20,2) NOT NULL,
    icon VARCHAR(255) NOT NULL,
    admin_account VARCHAR(255),
    admin_email VARCHAR(255)
);

-- create table exchange with wallet_id and user_id as foreign key
CREATE TABLE exchanges (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    exchange_id VARCHAR(255) UNIQUE NOT NULL,
    send_wallet_id INT NOT NULL,
    receive_wallet_id INT NOT NULL,
    user_id INT NOT NULL,
    send_amount NUMERIC(20,2) NOT NULL,
    receive_amount NUMERIC(20,2) NOT NULL,
    send_acc_no VARCHAR(255) NOT NULL,
    receive_acc_no VARCHAR(255) NOT NULL,
    receive_email VARCHAR(255),
    send_email VARCHAR(255),
    transaction_id VARCHAR(255),
    screen_shot VARCHAR(255),
    status VARCHAR(255) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP,
    FOREIGN KEY (send_wallet_id) REFERENCES wallets(wallet_id),
    FOREIGN KEY (receive_wallet_id) REFERENCES wallets(wallet_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- create table services
CREATE TABLE services (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    unit VARCHAR(255) NOT NULL,
    unitPrice INT NOT NULL,
    icon_url VARCHAR(255) NOT NULL,
    icon_public_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- insert data into exchange table
INSERT INTO exchanges (send_wallet_id, receive_wallet_id, user_id, amount, status) VALUES (1, 2, 1, 100, 'pending');

-- exchange  details query with wallet and user details
SELECT e.exchange_id, e.amount, e.status, e.created_at, e.updated_at, w.title, w.currency, w.wallet_company, w.wallet_type, w.min_amount, w.by_rate, w.sell_rate, w.is_send, w.is_receive, w.reserve, w.icon, w.admin_account, w.admin_email, u.username, u.name, u.email, u.phone, u.password, u.address, u.city, u.state, u.zip, u.country, u.role, u.created_at FROM exchanges e INNER JOIN wallets w ON e.wallet_id = w.wallet_id INNER JOIN users u ON e.user_id = u.user_id;

SELECT e.exchange_id, e.amount, e.status,  w.title, w.currency, w.wallet_company, w.wallet_type, w.min_amount, w.by_rate, w.sell_rate, w.is_send, w.is_receive, w.reserve, w.icon, w.admin_account, w.admin_email, u.username, u.name, u.email, u.phone, u.password, u.address, u.city, u.state, u.zip, u.country, u.role, u.created_at FROM exchanges e INNER JOIN wallets w ON e.send_wallet_id = w.wallet_id INNER JOIN users u ON e.user_id = u.user_id;

SELECT e.exchange_id, e.amount, s.title as send_wallet, r.title as receive_wallet, e.status, e.created_at, e.updated_at, w.title, w.currency, w.wallet_company, w.wallet_type, w.min_amount, w.by_rate, w.sell_rate, w.is_send, w.is_receive, w.reserve, w.icon, w.admin_account, w.admin_email, u.username, u.name, u.email, u.phone, u.password, u.address, u.city, u.state, u.zip, u.country, u.role, u.created_at FROM exchanges e INNER JOIN wallets w ON e.send_wallet_id = w.wallet_id INNER JOIN wallets s ON e.send_wallet_id = s.wallet_id INNER JOIN wallets r ON e.receive_wallet_id = r.wallet_id INNER JOIN users u ON e.user_id = u.user_id;

-- get exchange details by id with wallet and user details
SELECT e.exchange_id, e.amount, e.status, e.created_at, e.updated_at, w.title, w.currency, w.wallet_company, w.wallet_type, w.min_amount, w.by_rate, w.sell_rate, w.is_send, w.is_receive, w.reserve, w.icon, w.admin_account, w.admin_email, u.username, u.name, u.email, u.phone, u.password, u.address, u.city, u.state, u.zip, u.country, u.role, u.created_at FROM exchanges e INNER JOIN wallets w ON e.wallet_id = w.wallet_id INNER JOIN users u ON e.user_id = u.user_id WHERE e.exchange_id = 1;

SELECT e.exchange_id, e.amount, e.status,  s.title as send_wallet, s.currency, r.title as receive_wallet, r.currency, u.username, u.name FROM exchanges e INNER JOIN wallets s ON e.send_wallet_id = s.wallet_id INNER JOIN wallets r ON e.receive_wallet_id = r.wallet_id INNER JOIN users u ON e.user_id = u.user_id WHERE e.exchange_id = 1;


SELECT
	*
FROM
	information_schema.columns
WHERE
	table_schema = 'public'
	AND table_name = 'wallets';

-- multiple delete query in users table
DELETE FROM users WHERE user_id IN (1, 2, 3);


--update user role
UPDATE users SET role = 'admin' WHERE user_id = 1;

--service_order table with multiple services
CREATE TABLE service_orders (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    user_id INT NOT NULL,
    service_id BIGINT[],
    FOREIGN KEY (user_id) REFERENCES users(user_id)
    FOREIGN KEY (service_id) REFERENCES services(id)
);

-- insert data into service_orders table
INSERT INTO service_orders (user_id, service_ids) VALUES (1, '{3, 4, 5}');

-- get service_order details by id with service details
SELECT so.id,  so.service_ids, s.name, s.description, s.unit, s.unitPrice, s.icon_url FROM service_orders so INNER JOIN services s ON so.service_ids = s.id WHERE so.id = 1;

-- get service_order details by id with service details
SELECT so.id, so.user_id, so.service_ids, s.name, s.description, s.unit, s.unitPrice, s.icon_url, s.icon_public_id, s.created_at, s.updated_at FROM service_orders so INNER JOIN services s ON so.service_ids = s.id WHERE so.id = 1;


--service_order_item table with multiple service
CREATE TABLE service_order_items (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    service_order_id INT NOT NULL,
    service_id INT NOT NULL,
    quantity INT NOT NULL,
    discount NUMERIC(20,2) DEFAULT 0,
    total NUMERIC(20,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (service_order_id) REFERENCES service_orders(id),
    FOREIGN KEY (service_id) REFERENCES services(id)
);


--insert data into service_order table
INSERT INTO service_orders (service_id, user_id, quantity, discount, total, address, city, state, zip, country, phone, status) VALUES (1, 1, 1, 0, 100, 'address', 'city', 'state', 'zip', 'country', 'phone', 'pending');

--insert data into service_order_item table
INSERT INTO service_order_items (service_order_id, service_id, quantity, unitPrice, discount, total) VALUES (1, 1, 1, 100, 0, 100);

--get service order details with service order item details amd user details
SELECT so.id, so.service_id, so.user_id, so.quantity, so.discount, so.total, so.address, so.city, so.state, so.zip, so.country, so.phone, so.status, so.created_at, so.updated_at, soi.id, soi.service_order_id, soi.service_id, soi.quantity, soi.unitPrice, soi.discount, soi.total, soi.created_at, soi.updated_at, u.username, u.name, u.email, u.phone, u.password, u.address, u.city, u.state, u.zip, u.country, u.role, u.created_at FROM service_orders so INNER JOIN service_order_items soi ON so.id = soi.service_order_id INNER JOIN users u ON so.user_id = u.user_id;

--update service order_item 
UPDATE service_order_items SET quantity = 2, unitPrice = 200, discount = 0, total = 400 WHERE id = 1;



