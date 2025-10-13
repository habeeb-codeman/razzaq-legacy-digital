# Product Bulk Import & Management

## Overview
The product management system allows admins to add products individually or in bulk via JSON import, manage images, and control publishing status.

## Bulk Import Workflow

### 1. Prepare JSON Data
**Location**: `/admin/products/bulk-import`

Create a JSON file with an array of products:

```json
[
  {
    "name": "Brake Pad Set",
    "description": "High-performance ceramic brake pads",
    "short_description": "Ceramic brake pads for optimal stopping power",
    "price": 2500,
    "tags": ["brakes", "safety", "performance"],
    "category": "Brake System",
    "published": false
  },
  {
    "name": "Engine Oil Filter",
    "description": "Premium oil filter for engine protection",
    "short_description": "High-quality oil filtration",
    "price": 450,
    "tags": ["engine", "maintenance", "filters"],
    "category": "Engine Components",
    "published": false
  }
]
```

### 2. Field Specifications

#### Required Fields
- `name` (string, max 200 chars): Product name
- `price` (number, min 0): Product price in INR

#### Optional Fields
- `description` (string): Full product description
- `short_description` (string, max 300 chars): Brief summary
- `tags` (array of strings): Searchable keywords
- `category` (string): Product category name
- `published` (boolean, default: false): Publish immediately or keep as draft

#### Auto-Generated Fields
- `product_code`: Unique code in format `PRD-YYYYMMDD-####`
- `slug`: URL-friendly version of product name
- `images`: Empty array (add images after import)
- `created_at`: Timestamp of creation
- `created_by`: Admin user ID

### 3. Import Process

1. **Download Example**: Click "Download Example JSON" to get a template
2. **Prepare Data**: Fill in your product details
3. **Upload or Paste**:
   - Option A: Click "Choose File" and select your JSON file
   - Option B: Paste JSON directly into the text area
4. **Validate**: Click "Import Products"
5. **System Process**:
   - Validates JSON format
   - Checks required fields
   - Creates/links categories automatically
   - Generates unique product codes
   - Inserts products as UNPUBLISHED drafts
6. **Success**: Shows count of imported products

### 4. After Import: Add Images

**Location**: `/admin/products`

1. **Find Draft Products**: Look for "DRAFT" badge on product cards
2. **Click Edit**: Open the product editor
3. **Upload Images**:
   - Drag & drop images or click to browse
   - Supports: JPG, PNG, WEBP
   - Recommended size: 1200x1200px or higher
   - Max 5 images per product
4. **Reorder Images**: Drag thumbnails to change order
5. **Save Changes**: Images are uploaded to cloud storage

### 5. Publishing Products

**Important**: Products imported via JSON are **NOT PUBLISHED** by default. This allows you to:
- Review product details
- Add images
- Test the product page
- Make adjustments before going live

**To Publish**:
1. Navigate to product in admin panel
2. Toggle "Published" switch to ON
3. Product becomes visible on public site

## Product Management

### Product Card Actions

#### Admin View (`/admin/products`)
- **Edit**: Opens product editor
- **Toggle Published**: Show/hide on public site
- **Delete**: Permanently remove (with confirmation)
- **View Images**: Shows image count or "No Images" badge

#### Public View (`/product`)
- Only published products are visible
- Displays: name, description, price, images, category, tags
- Contact button for inquiries

### Search & Filter
- Search by: product name, code, description, tags
- Filter by: published status (visible in UI with badges)

### Product Categories
- Automatically created during bulk import if they don't exist
- Linked to products via `category_id`
- Can be viewed/managed separately

## Database Schema

### Products Table
- `id`: UUID (primary key)
- `product_code`: Text (unique, auto-generated)
- `name`: Text (required)
- `slug`: Text (unique, auto-generated)
- `short_description`: Text
- `description`: Text
- `price`: Numeric (required)
- `images`: JSONB array (URLs to storage)
- `tags`: Text array
- `category_id`: UUID (foreign key to categories)
- `published`: Boolean (default: false)
- `created_by`: UUID (admin user ID)
- `phone`: Text (contact number)
- `created_at`: Timestamp
- `updated_at`: Timestamp

### Product Categories Table
- `id`: UUID (primary key)
- `name`: Text (unique)
- `slug`: Text (unique)
- `description`: Text
- `created_at`: Timestamp
- `updated_at`: Timestamp

## Security

### Row-Level Security (RLS)
- **Anyone** can view published products
- **Only Admins** can:
  - View unpublished products
  - Create products
  - Update products
  - Delete products
  - Manage categories

### Storage Security
- `product-images` bucket is PUBLIC
- Images are accessible via direct URLs
- Only admins can upload/delete images
- Files organized by product: `{product_id}/{image_name}`

## Best Practices

### 1. Bulk Import Strategy
- Import products in batches of 50-100 at a time
- Keep `published: false` for initial imports
- Review and add images before publishing
- Use consistent category names

### 2. Product Naming
- Use clear, descriptive names
- Include brand if relevant
- Avoid special characters in names
- Keep under 200 characters

### 3. Images
- Use high-quality images (min 800x800px)
- First image is the main/hero image
- Show product from different angles
- Compress images before upload (recommended < 500KB each)
- Use consistent aspect ratios

### 4. Descriptions
- `short_description`: One-line summary (max 300 chars)
- `description`: Full details, specifications, features
- Use clear, benefit-focused language
- Include technical specs if applicable

### 5. Pricing
- Enter price in INR (Indian Rupees)
- Ensure price is accurate before publishing
- Update prices using the product editor

### 6. Tags
- Use 3-10 relevant tags per product
- Lowercase, single words or short phrases
- Examples: "brake-pads", "engine-oil", "performance"
- Helps with search and discovery

### 7. Categories
- Use existing categories when possible
- Create new categories only when needed
- Keep category names consistent (e.g., "Engine Components" not "engine parts")

## Troubleshooting

### Import Errors

#### "Invalid JSON format"
- **Cause**: Malformed JSON
- **Solution**: Validate your JSON using JSONLint or similar tool
- **Common Issues**: Missing commas, quotes, brackets

#### "Missing required fields"
- **Cause**: Product missing `name` or `price`
- **Solution**: Ensure every product has at least `name` and `price`

#### "Failed to import"
- **Cause**: Database error or permissions issue
- **Solution**: Check that you're logged in as admin and have correct role

### Image Upload Issues

#### "Failed to upload image"
- **Cause**: File too large, wrong format, or storage error
- **Solution**: 
  - Ensure file is JPG, PNG, or WEBP
  - Compress image if over 5MB
  - Check internet connection

#### "Image not displaying"
- **Cause**: Image URL incorrect or storage permissions
- **Solution**: Re-upload image or contact support

### Product Not Visible

#### "Can't see product on public site"
- **Cause**: Product is not published
- **Solution**: Toggle "Published" switch in admin panel

#### "Blank product page"
- **Cause**: Missing data or load error
- **Solution**: Check console logs, ensure product has all required fields

## Example Workflows

### Workflow 1: New Product Line
1. Prepare JSON with 20 new products, all with `published: false`
2. Import via bulk import page
3. Navigate to Products page
4. For each product:
   - Click Edit
   - Upload 3-5 images
   - Review description
   - Save
5. Once all images added, publish products in batches
6. Verify on public site

### Workflow 2: Quick Single Product
1. Navigate to Products page
2. Click "Add Product" (individual form)
3. Fill in all fields
4. Upload images
5. Toggle "Published" to ON
6. Save

### Workflow 3: Seasonal Catalog Update
1. Export current products (future feature)
2. Update prices in exported JSON
3. Add new products to JSON
4. Bulk import (system will skip duplicates by name)
5. Review and publish

## Tips

- **Always keep `published: false`** for initial imports to review before going live
- **Use descriptive tags** for better search results
- **Add multiple images** - first image is the hero/thumbnail
- **Write compelling descriptions** - helps with SEO and conversions
- **Organize by categories** for easier navigation
- **Check spelling** before importing - easier to fix in JSON than individually
- **Back up your JSON file** before importing
- **Test with 2-3 products first** before bulk importing hundreds

## Future Enhancements

- [ ] CSV import support
- [ ] Excel import support
- [ ] Product duplication
- [ ] Bulk edit (prices, categories, etc.)
- [ ] Product variants (sizes, colors)
- [ ] Inventory tracking
- [ ] Product reviews
- [ ] Related products
- [ ] Featured products
- [ ] Product analytics
- [ ] Bulk image upload
- [ ] Import with images (via URLs)
