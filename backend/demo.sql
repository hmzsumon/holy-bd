-- --create table student_info
-- CREATE TABLE student_info (
--     id BIGSERIAL NOT NULL PRIMARY KEY,
--     name VARCHAR(255) NOT NULL,
--     subjects VARCHAR[][] UNIQUE,
--     marks INT[][]

-- );

-- -- insert data into student_info
-- INSERT INTO student_info (name, subjects, marks) VALUES ('John', ARRAY[ARRAY['Maths', 'Physics'], ARRAY['Chemistry', 'Biology']], ARRAY[ARRAY[90, 80], ARRAY[70, 60]]);

-- --insert key value pair into student_info
-- INSERT INTO student_info (name, subjects, marks) VALUES ('Sumon', ARRAY[ARRAY['Maths', 'Physics'], ARRAY['Chemistry', 'Biology']], ARRAY[ARRAY[90, 80], ARRAY[70, 60]]) ON CONFLICT (name) DO UPDATE SET subjects = EXCLUDED.subjects, marks = EXCLUDED.marks;



-- -- select data from student_info
-- SELECT * FROM student_info;

-- -- select data from student_info where name is John subject mrks
-- SELECT name, subjects[1][1], marks[1][1] FROM student_info WHERE name = 'John';

-- create table key value pair student_info
CREATE TABLE student_info (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    subjects VARCHAR[][] UNIQUE,
    marks INT[][]
);

-- insert data into student_info key value pair
INSERT INTO student_info (name, subjects, marks) VALUES ('John', ARRAY[ARRAY['Maths', 'Physics'], ARRAY['Chemistry', 'Biology']], ARRAY[ARRAY[90, 80], ARRAY[70, 60]]) ON CONFLICT (name) DO UPDATE SET subjects = EXCLUDED.subjects, marks = EXCLUDED.marks;


-- https://www.delftstack.com/howto/postgres/postgres-update-json-field/

CREATE TABLE products (
  id BIGSERIAL NOT NULL PRIMARY KEY,
  details JSONB
);

INSERT INTO products (details) VALUES ('{"name": "Apple", "price": 100, "quantity": 2}');
INSERT INTO products (details) VALUES ('{"name": "Orange", "price": 50, "quantity": 3}');
INSERT INTO products (details) VALUES ('{"name": "Banana", "price": 20, "quantity": 5}');

-- update a single key value pair from products table with josnb data type
UPDATE products SET details = jsonb_set(details, '{price}', '200') WHERE id = 1;

-- dalate a single key value pair from products table with josnb data type
UPDATE products SET details = jsonb_set(details, '{price}', 'null') WHERE id = 1;

-- rmaove a single key value pair from products table with josnb data type
UPDATE products SET details = details - 'price' WHERE id = 1;

SELECT * FROM product

UPDATE product
SET details = details || '{"GPU":"RTX 3060"}'
WHERE product='PC1';


UPDATE product
SET details = JSONB_SET(details,'{CPU}','"Sumon 20"')
WHERE product='PC1';

DROP TABLE product

CREATE TABLE order_info (
  id BIGSERIAL NOT NULL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  orders_items JSONB
);

INSERT INTO order_info (name, orders_items) VALUES ('Sumon', '[{"item_id":1,"name": "Apple", "price": 100, "quantity": 2}, {"item_id":2,"name": "Orange", "price": 50, "quantity": 3}]');
INSERT INTO order_info (name, orders_items) VALUES ('John', '[{"item_id":1,"name": "Apple", "price": 100, "quantity": 2}, {"item_id":2,"name": "Orange", "price": 50, "quantity": 3}]');


-- get a single key value pair from order_info table with josnb data type
SELECT order_info.orders_items->0->>'name' FROM order_info WHERE id = 1;

-- get a single key value pair from order_info table with josnb data type by name
SELECT order_info.orders_items->0->>'name' FROM order_info WHERE name = 'Sumon';

-- get a jsonb array from order_info table with josnb data type by item_id
SELECT order_info.orders_items FROM order_info WHERE order_info.orders_items @> '[{"item_id":1}]';

-- get a jsonb array from order_info table with josnb data type by item_id by order_info id
SELECT order_info.orders_items FROM order_info WHERE order_info.orders_items @> '[{"item_id":1}]' AND id = 1;

-- update a single key value pair from products table with josnb data type
UPDATE order_info SET orders_items = jsonb_set(orders_items, '{0,price}', '200') WHERE id = 1;

-- sum of all price from order_info table with josnb data type where id = 1
SELECT SUM(orders_items->>'price')::int FROM order_info WHERE id = 1;




-- 