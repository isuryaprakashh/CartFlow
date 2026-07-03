# Product Requirements Document (PRD)

# CartFlow -- Shopping Cart Management System

## Version 2.0 -- Multi-User Shopping Platform

> Version 2 builds on Version 1. All Version 1 features remain
> functional.

## Overview

Version 2 transforms CartFlow into a secure multi-user shopping platform
with authentication, authorization, dashboards, categories, wishlists,
reviews, and coupons.

## Objectives

-   Multi-user support
-   JWT authentication
-   Admin and Customer roles
-   Enhanced shopping experience
-   Maintain all Version 1 functionality

## Version 1 Features (Retained)

### Product Management

-   Product CRUD
-   Product Details
-   Search
-   Filter
-   Sort
-   SKU Validation

### Shopping Cart

-   Add to Cart
-   Merge Duplicate Products
-   Update Quantity
-   Remove Item
-   Clear Cart
-   Persistent Cart

### Inventory

-   Stock Validation
-   Prevent Overselling

### Checkout

-   Checkout
-   Order Creation
-   Order History
-   Order Details

### System

-   REST APIs
-   Exception Handling
-   MySQL Persistence
-   Layered Architecture

## New Features

### Authentication

-   Registration
-   Login
-   Logout
-   JWT
-   BCrypt Password Encryption

### Roles

#### Admin

-   Product Management
-   Category Management
-   User Management
-   Order Management
-   Dashboard

#### Customer

-   Browse Products
-   Manage Cart
-   Checkout
-   Wishlist
-   Order History

### User Profile

-   Update Profile
-   Change Password
-   Profile Image
-   Address
-   Phone Number

### Categories

-   CRUD Categories
-   Assign Products to Categories

### Product Images

-   Upload Image
-   Store Image URL

### Search

-   Search by Name
-   Search by SKU
-   Search by Category

### Filtering

-   Category
-   Price Range
-   Stock Status

### Pagination

-   Backend Pagination
-   Frontend Pagination

### Wishlist

-   Add
-   Remove
-   Move to Cart

### Save for Later

-   Save Cart Items
-   Restore to Cart

### Reviews

-   Ratings
-   Reviews
-   Average Rating

### Customer Dashboard

-   Cart Summary
-   Wishlist Count
-   Recent Orders
-   Profile Summary

### Admin Dashboard

-   Total Products
-   Total Categories
-   Total Users
-   Total Orders
-   Revenue
-   Low Stock Products

### Order Status

-   Pending
-   Confirmed
-   Packed
-   Shipped
-   Delivered
-   Cancelled

### Coupons

-   Create Coupon
-   Update Coupon
-   Apply Coupon

### Notifications

-   Registration
-   Product Added
-   Order Placed
-   Coupon Applied

### Email

-   Registration Email
-   Order Confirmation
-   Password Reset

### Logging

-   Login Logs
-   Product Logs
-   Order Logs
-   Exception Logs

## Database

### Existing Tables

-   products
-   cart_items
-   orders
-   order_items

### New Tables

-   users
-   roles
-   categories
-   wishlist
-   saved_items
-   reviews
-   coupons

## APIs

### Authentication

-   POST /api/auth/register
-   POST /api/auth/login

### Users

-   GET /api/users/profile
-   PUT /api/users/profile
-   PUT /api/users/password

### Categories

-   CRUD APIs

### Wishlist

-   CRUD APIs

### Reviews

-   GET Reviews
-   POST Review

### Coupons

-   CRUD APIs
-   Apply Coupon API

## Security

-   JWT Authentication
-   BCrypt
-   Role-Based Authorization
-   Input Validation
-   Protected APIs
-   CORS

## Success Criteria

-   Version 1 remains fully functional.
-   Multi-user support.
-   Secure authentication.
-   Role-based access.
-   Wishlists, reviews, coupons, dashboards, and categories are fully
    integrated.

## Future (Version 3)

-   Payment Gateway
-   AI Recommendations
-   Analytics
-   Docker
-   CI/CD
-   Cloud Deployment
-   Microservices
