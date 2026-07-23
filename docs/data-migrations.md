# Data migrations

## 2026-07-23 - Bag audience assignment

After introducing the gender field for product collections, 22 existing active products in the exact Bags category had no audience value. They were migrated in MongoDB to:

{ "gender": "men" }

Women's Bags intentionally remained empty. The migration was limited to products whose category matched Bags exactly (case-insensitive); products in other categories were not changed.

New products should receive men, women, or unisex through the Audience selector in the admin product form.

