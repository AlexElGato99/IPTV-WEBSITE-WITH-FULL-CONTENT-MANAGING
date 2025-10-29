# 🎬 IPTV ACCESS - Premium IPTV Website with Full Content Management

[![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Latest-green?style=flat-square&logo=node.js)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-blue?style=flat-square&logo=mysql)](https://mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

> **Professional IPTV streaming website with powerful admin dashboard, SEO optimization, and complete content management system.**



## 🚀 Features## ✨ Features



- **Dynamic Pricing Plans** - Multiple device options (Android, Smart TV, MAG, etc.)### Frontend (Next.js)

- **FAQ Management** - Admin can add/edit/delete FAQs with drag-and-drop ordering- ✅ Modern, responsive landing page

- **Logo System** - Support for both image logos (PNG, JPG, SVG, etc.) and text logos- ✅ Optimized for SEO

- **Responsive Design** - Mobile-friendly layout with flexbox- ✅ Dynamic pricing section (1, 2, 3, 6 devices)

- **Admin Dashboard** - Full control over site content, settings, and plans- ✅ Channel showcases & FAQ

- **WhatsApp Integration** - Direct contact via WhatsApp- ✅ Mobile-friendly design

- **Streaming Services Display** - Animated logos showcase

- **Movie Catalog** - Auto-scrolling movie posters### Backend (Node.js + Express + MySQL)

- ✅ RESTful API

## 📁 Project Structure- ✅ JWT authentication

- ✅ MySQL database

```- ✅ Image upload for logos

├── backend/              # Node.js + Express API- ✅ Production-ready for cPanel

│   ├── config/          # Database configuration

│   ├── middleware/      # Authentication middleware### Admin Panel

│   ├── routes/          # API endpoints- ✅ **Logo Management:** Upload and change site logo

│   ├── uploads/         # User-uploaded files (logos)- ✅ **Pricing Control:** Edit all plans (name, price, features)

│   ├── database.sql     # Database schema- ✅ **Featured Plans:** Mark plans as "Popular"

│   └── server.js        # Express server- ✅ **Contact Info:** Update email and WhatsApp number

│- ✅ **Secure Login:** JWT authentication

├── next-app/            # Next.js 15 frontend

│   ├── app/## 🚀 Quick Start

│   │   ├── components/  # React components

│   │   ├── admin/       # Admin dashboard### 1. Setup Database

│   │   └── page.jsx     # Main page

│   ├── lib/             # Utility functions```bash

│   ├── public/          # Static assetsmysql -u root -p

│   └── styles/          # Global CSSCREATE DATABASE iptv_database;

│USE iptv_database;

├── images/              # Project images (logos, posters, etc.)SOURCE backend/database.sql;

├── START-BACKEND.bat    # Windows: Start backend server```

└── START-FRONTEND.bat   # Windows: Start frontend server

```### 2. Backend



## 🛠️ Tech Stack```bash

cd backend

### Backendnpm install

- **Node.js** with Express# Edit .env with MySQL credentials

- **MySQL** databasenpm run dev

- **JWT** authentication```

- **Multer** for file uploads

- **bcryptjs** for password hashingRuns on: **http://localhost:5000**



### Frontend### 3. Frontend

- **Next.js 15.5.6**

- **React 18**```bash

- **CSS** (Flexbox layout)cd next-app

- Dynamic API integrationnpm install

npm run dev

## 📋 Prerequisites```



- Node.js (v18 or higher)Runs on: **http://localhost:3000**

- MySQL Server

- Windows OS (for .bat scripts) or modify for your OS### 4. Admin Access



## ⚙️ Installation- URL: **http://localhost:3000/admin/login**

- Email: `admin@site.com`

### 1. Clone/Download Project- Password: `admin123`

```bash

cd "d:\download\iptv template from zero"## 📚 Documentation

```

- **[SETUP.md](./SETUP.md)** - Detailed setup guide

### 2. Setup Backend- **[backend/README.md](./backend/README.md)** - API docs

- **[backend/DEPLOYMENT.md](./backend/DEPLOYMENT.md)** - cPanel deployment

```bash

cd backend## 🎯 What You Can Manage

npm install

```- Logo (upload image)

- Contact email & WhatsApp

Create `.env` file:- Pricing plans (name, price, features)

```env- Featured badges

DB_HOST=localhost- All 4 device tiers (1/2/3/6)

DB_USER=root

DB_PASSWORD=## 🛠️ Tech Stack

DB_NAME=iptv_database

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production**Frontend:** Next.js 15, React 18  

PORT=5000**Backend:** Node.js, Express, MySQL  

```**Auth:** JWT with httpOnly cookies



Import database:## 🌐 Deploy to cPanel

```bash

mysql -u root -p < database.sqlSee [backend/DEPLOYMENT.md](./backend/DEPLOYMENT.md) for full instructions.

```

---

### 3. Setup Frontend

**Built for IPTV service providers** 🚀

```bash
cd ../next-app
npm install
```

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 🚀 Running the Project

### Option 1: Windows Batch Files (Easiest)
Double-click these files:
1. `START-BACKEND.bat` - Starts backend on port 5000
2. `START-FRONTEND.bat` - Starts frontend on port 3000

### Option 2: Manual Start

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd next-app
npm run dev
```

### Access:
- **Website**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin/dashboard
- **API**: http://localhost:5000/api

## 🔐 Default Admin Credentials

```
Email: admin@site.com
Password: admin123
```

**⚠️ IMPORTANT:** Change these in production!

## 📱 Admin Panel Features

### Settings Management
- Upload/change site logo (supports PNG, JPG, SVG, GIF, WebP, BMP, ICO, TIFF)
- Toggle between image logo or text logo
- Update contact email
- Update WhatsApp number

### Plans Management
- Add/edit/delete pricing plans
- Set device types (Android, Smart TV, MAG, etc.)
- Mark plans as "featured"
- Manage display order

### FAQ Management
- Add/edit/delete frequently asked questions
- Reorder FAQs with display_order
- Dynamic rendering on main site

## 🎨 Customization

### Changing Colors
Edit `next-app/styles/globals.css`:
```css
:root {
    --accent: #86ff00;  /* Change to your brand color */
    --bg: #050505;      /* Background color */
    --muted: #bdbdbd;   /* Text muted color */
}
```

### Adding More Pages
Create new files in `next-app/app/`:
```
app/
  ├── about/
  │   └── page.jsx
  └── contact/
      └── page.jsx
```

## 🗄️ Database Schema

### Tables:
- **admins** - Admin users with hashed passwords
- **settings** - Site configuration (logo, email, WhatsApp)
- **plans** - Pricing plans with unique constraint on (device_tab, name)
- **faqs** - FAQ items with display order

## 📊 API Endpoints

### Public Endpoints
- `GET /api/settings` - Get site settings
- `GET /api/plans` - Get all pricing plans
- `GET /api/faqs` - Get all FAQs

### Protected Endpoints (require JWT)
- `POST /api/admin/login` - Admin login
- `PUT /api/settings` - Update settings
- `POST /api/upload` - Upload logo
- `POST /api/plans` - Create plan
- `PUT /api/plans/:id` - Update plan
- `DELETE /api/plans/:id` - Delete plan
- `POST /api/faqs` - Create FAQ
- `PUT /api/faqs/:id` - Update FAQ
- `DELETE /api/faqs/:id` - Delete FAQ

## 🐛 Troubleshooting

### Backend won't start
- Check MySQL is running
- Verify database exists: `mysql -u root -p -e "SHOW DATABASES;"`
- Check port 5000 is not in use

### Frontend shows "Failed to fetch"
- Ensure backend is running on port 5000
- Check CORS settings in `backend/server.js`
- Verify `.env.local` has correct API URL

### Images not displaying
- Check `backend/uploads/` folder exists
- Verify file permissions
- Check image path in database

## 📝 License

This project is proprietary. All rights reserved.

## 👨‍💻 Support

For issues or questions, contact via WhatsApp (configured in admin panel).

---

**Built with ❤️ for IPTV service providers**
