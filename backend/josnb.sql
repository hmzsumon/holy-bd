-- create student_info table with josnb data type

CREATE TABLE student_info (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    marks JSONB
);

-- insert data into student_info table with josnb data type
INSERT INTO student_info (name, marks) VALUES ('John', '[{"Maths": 90, "Bangla": 80}]')



INSERT INTO student_info (name, subjects, marks) VALUES ('Sumon', '[{"Maths": "Physics"}, {"Chemistry": "Biology"}]', '[{"Maths": 90, "Physics": 80}, {"Chemistry": 70, "Biology": 60}]')

-- select data from student_info table with josnb data type
SELECT * FROM student_info;

-- update  a specific key value pair from student_info table with josnb data type
UPDATE student_info SET marks = marks || '[{"Maths": 90, "Physics": 80}, {"Chemistry": 70, "Biology": 60}]' WHERE name = 'John';

-- update a single key value pair from student_info table with josnb data type
UPDATE student_info SET marks = jsonb_set(marks, '{0,Physics}', '80') WHERE name = 'John';

-- delete a single key value pair from student_info table with josnb data type
UPDATE student_info SET marks = jsonb_set(marks, '{0,Physics}', 'null') WHERE name = 'John';

--create order_info table with josnb data type
CREATE TABLE order_info (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    order_items JSONB
);

-- insert data into order_info table with josnb data type
const items = [
    {
        "name": "Apple",
        "price": 100,
        "quantity": 2
    },
    {
        "name": "Orange",
        "price": 50,
        "quantity": 3
    },
]

INSERT INTO order_info (name, order_items) VALUES ('John', '[{"name": "Apple", "price": 100, "quantity": 2}, {"name": "Orange", "price": 50, "quantity": 3}]')