INSERT INTO public.account
	(account_firstname,
	account_lastname,
	account_email,
	account_password)
VALUES ('Tony', 
		'Stark', 
		'tony@starkent.com', 
		'Iam1ronM@n'
		);
    
UPDATE public.account
SET account_type='Admin'
WHERE account_id=1;

DELETE FROM public.account WHERE account_id=1;

-- "a huge interior" rather than "small interiors"
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'the small interiors', 'a huge interior')
WHERE inv_description LIKE '%the small interiors%';

SELECT 
	inventory.inv_make,
	inventory.inv_model
FROM 
	public.inventory as inventory
INNER JOIN public.classification AS cs 
ON cs.classification_name = inventory.inv_model;

UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images', '/images/vehicles'),
	inv_thumbnail = REPLACE(inv_thumbnail, '/images', '/images/vahicles')
WHERE 
	inv_image LIKE '/images%' OR inv_thumbnail LIKE '/images%'
