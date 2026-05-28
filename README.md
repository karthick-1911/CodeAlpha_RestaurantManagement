# CodeAlpha Restaurant Management System

A Restaurant Management System backend built with Node.js, Express.js and MongoDB.

## Features
- Menu management with categories
- Table management with availability tracking
- Order placement with automatic bill calculation
- Order status tracking (pending → preparing → served → completed)
- Automatic table release when order completed
- Inventory management with low stock alerts
- Filter menu by category
- View only available tables

## Tech Stack
- Node.js
- Express.js
- MongoDB + Mongoose

## API Endpoints

### Menu
| Method | Route | Description |
|--------|-------|-------------|
| GET | /menu | Get all menu items |
| GET | /menu/category/:category | Get items by category |
| POST | /menu | Add new menu item |
| PATCH | /menu/:id | Update item availability |
| DELETE | /menu/:id | Delete menu item |

### Tables
| Method | Route | Description |
|--------|-------|-------------|
| GET | /tables | Get all tables |
| GET | /tables/available | Get available tables only |
| POST | /tables | Add new table |
| PATCH | /tables/:id | Update table status |
| DELETE | /tables/:id | Delete table |

### Orders
| Method | Route | Description |
|--------|-------|-------------|
| POST | /orders | Place new order |
| GET | /orders | Get all orders |
| GET | /orders/:id | Get single order |
| PATCH | /orders/:id | Update order status |

### Inventory
| Method | Route | Description |
|--------|-------|-------------|
| GET | /inventory | Get all inventory |
| GET | /inventory/lowstock | Get low stock items |
| POST | /inventory | Add inventory item |
| PATCH | /inventory/:id | Update stock quantity |
| DELETE | /inventory/:id | Delete inventory item |

## How to run
1. Clone the repo
2. Run npm install
3. Add .env file with MONGODB_URI and PORT
4. Run node index.js
