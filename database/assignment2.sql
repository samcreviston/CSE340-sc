--insert Tony
INSERT INTO public.account (first_name, last_name, email, password)
VALUES
(Tony, Stark, tony@starkent.com, Iam1ronM@n);

--update Tony to admin
UPDATE "account" SET account_type = 'admin' WHERE last_name = 'Stark';

--delete Tony
DELETE FROM "account" WHERE last_name = 'Stark';

--update hummer description
UPDATE "inventory"
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_model = 'Hummer';

--Use join to see sport cars from 
SELECT inventory.inv_make, inventory.inv_model FROM inventory JOIN classification ON classification.classification_id = inventory..classification_id;

--add /vehicle to file path for all vehicles
UPDATE "inventory"
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/');