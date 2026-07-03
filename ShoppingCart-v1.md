# Product Requirements Document (PRD)

## CartFlow -- Shopping Cart Management System (CRUD MVP)

**Version:** 1.0 (MVP)

## Objective

Build a simple full-stack Shopping Cart Management application using
**React, Spring Boot, and MySQL**. The primary goal is to master CRUD
operations, REST APIs, database integration, and frontend-backend
communication before adding advanced e-commerce features.

------------------------------------------------------------------------

# 1. Problem Statement

Managing shopping cart items manually is inefficient and error-prone.
This application allows users to add products to a cart, update
quantities, remove products, and view the total cart value through a
clean web interface.

This MVP focuses on learning full-stack development rather than building
a complete e-commerce platform.

------------------------------------------------------------------------

# 2. Goals

## Primary Goals

-   Learn React CRUD operations
-   Build REST APIs with Spring Boot
-   Connect Spring Boot to MySQL
-   Use JPA/Hibernate
-   Practice frontend-backend integration using Axios
-   Understand state management
-   Build reusable UI components

## Out of Scope (MVP)

-   Authentication
-   Payment Gateway
-   Order Management
-   Wishlist
-   Product Images
-   Inventory Management
-   Admin Dashboard

------------------------------------------------------------------------

# 3. Tech Stack

## Frontend

-   React
-   Vite
-   Tailwind CSS
-   Axios
-   React Router DOM

## Backend

-   Spring Boot
-   Spring Data JPA
-   MySQL Connector
-   Maven

## Database

-   MySQL

------------------------------------------------------------------------

# 4. User Roles

Only one role.

### User

No login required.

------------------------------------------------------------------------

# 5. Functional Requirements

## Product Management

Users can:

-   Add a product
-   View all products
-   Update a product
-   Delete a product

Each product contains:

-   Product Name
-   SKU
-   Category
-   Price
-   Quantity

## Shopping Cart

Users can:

-   Add product to cart
-   View cart
-   Update quantity
-   Remove product
-   Clear cart

## Cart Summary

Display:

-   Total Items
-   Total Quantity
-   Total Price

Automatically update after every operation.

------------------------------------------------------------------------

# 6. User Flow

``` text
Home
↓
Product List
↓
Add Product
↓
Save
↓
Product appears in list
↓
Edit/Delete
↓
Shopping Cart
↓
Update Quantity
↓
Remove Item
↓
Clear Cart
```

------------------------------------------------------------------------

# 7. Pages

## Home

-   Navigation
-   Quick summary

## Products

Displays a product table.

Buttons:

-   Add Product
-   Edit
-   Delete
-   Add to Cart

## Add Product

Form fields:

-   Product Name
-   SKU
-   Category
-   Price
-   Quantity

Buttons:

-   Save
-   Cancel

## Edit Product

Same form with pre-filled values.

## Shopping Cart

Displays:

-   Products
-   Quantity
-   Price
-   Total
-   Remove button

Summary:

-   Total Items
-   Total Price

Buttons:

-   Update Quantity
-   Clear Cart

------------------------------------------------------------------------

# 8. UI Layout

``` text
------------------------------------
            Navbar
------------------------------------
Home | Products | Cart
------------------------------------
Products Table
------------------------------------
+ Add Product
------------------------------------
```

------------------------------------------------------------------------

# 9. Database Design

## products

  Field      Type
  ---------- ---------
  id         BIGINT
  sku        VARCHAR
  name       VARCHAR
  category   VARCHAR
  price      DOUBLE
  quantity   INT

## cart_items

  Field        Type
  ------------ --------
  id           BIGINT
  product_id   BIGINT
  quantity     INT

------------------------------------------------------------------------

# 10. Backend APIs

## Products

``` http
GET /api/products
GET /api/products/{id}
POST /api/products
PUT /api/products/{id}
DELETE /api/products/{id}
```

## Cart

``` http
GET /api/cart
POST /api/cart/add
PUT /api/cart/update/{id}
DELETE /api/cart/remove/{id}
DELETE /api/cart/clear
```

------------------------------------------------------------------------

# 11. Backend Architecture

``` text
controller/
    ProductController
    CartController

service/
    ProductService
    CartService

repository/
    ProductRepository
    CartRepository

entity/
    Product
    CartItem

config/
dto/
exception/
```

------------------------------------------------------------------------

# 12. Frontend Structure

``` text
src/
    components/
        Navbar.jsx
        ProductCard.jsx
        ProductForm.jsx
        CartItem.jsx

    pages/
        Home.jsx
        Products.jsx
        Cart.jsx

    services/
        api.js

    App.jsx
```

------------------------------------------------------------------------

# 13. Validation

-   Product Name: Required
-   SKU: Required and Unique
-   Category: Required
-   Price: Greater than 0
-   Quantity: Greater than or equal to 0

------------------------------------------------------------------------

# 14. Success Criteria

The application should allow users to:

-   Create products
-   Read products
-   Update products
-   Delete products
-   Add products to a cart
-   Update cart quantities
-   Remove cart items
-   View cart totals
-   Clear the cart

All changes should be reflected immediately in both the UI and the MySQL
database.

------------------------------------------------------------------------

# 15. Future Enhancements

-   JWT Authentication
-   Admin/User Roles
-   Product Images
-   Search & Filtering
-   Pagination
-   Inventory Management
-   Coupons
-   Wishlist
-   Save for Later
-   Orders
-   Dashboard Analytics
-   AI Recommendations
-   Docker
-   GitHub Actions CI/CD
-   Cloud Deployment

------------------------------------------------------------------------

# Development Roadmap

## Phase 1 -- Backend

-   Spring Boot setup
-   MySQL configuration
-   Entity design
-   Repository layer
-   Service layer
-   REST APIs
-   Postman testing

## Phase 2 -- Frontend

-   React + Vite + Tailwind setup
-   Build UI
-   Axios integration
-   CRUD operations
-   State management

## Phase 3 -- Integration & Testing

-   Connect frontend and backend
-   Validation
-   Error handling
-   Full CRUD testing
-   Responsive UI polishing
