# Yamuj Node.js Backend API

A modern, high-performance RESTful API built with **Node.js**, **TypeScript**, **Express 5**, and **MongoDB (Mongoose)**. This server powers the content management system, portfolio, user authentication, contact message workflows, media processing, and transactional emails for Yamuj.

---

## 🚀 Tech Stack

- **Runtime & Language:** Node.js, TypeScript (ES2022 / NodeNext ESM)
- **Web Framework:** [Express 5](https://expressjs.com/)
- **Database & ODM:** [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication & Security:** JWT (`jsonwebtoken`), Password Hashing (`bcryptjs`), CORS
- **Media Uploads & Storage:** [Multer](https://github.com/expressjs/multer), [Sharp](https://sharp.pixelplumbing.com/) (Image Processing), [Cloudinary](https://cloudinary.com/)
- **Email Notifications:** [Nodemailer](https://nodemailer.com/) (SMTP / Verification Codes)
- **Dev Tooling:** `tsx`, ESLint, Prettier

---

## ✨ Features

- **User Authentication & Authorization:**
  - Signup, Login, Password Reset via Email Code (10-min expiration)
  - JWT authentication & role-based request guards
- **Dynamic Content & Portfolio Modules:**
  - **Projects:** Create, update, list, and categorize showcase projects
  - **Services:** Manage offered services and descriptions
  - **Blog:** Manage articles and publishing status
  - **Brands:** Manage client and partner logos
  - **Testimonials:** Manage client feedback and reviews
  - **Statistics:** Manage company counter metrics and achievements
  - **About:** Dynamic section for company details
  - **Home:** Main landing page content configuration
  - **Settings:** General platform configuration settings
- **Contact Message Workflow:**
  - Submit contact inquiries
  - Admin email reply capabilities via Nodemailer (RTL styled templates)
- **Media Pipeline:**
  - Image optimization with Sharp & direct uploads to Cloudinary

---

## 🛠️ Project Structure

```text
yamuj-nodejs-app/
├── config/                  # DB connection & Cloudinary setup
│   ├── cloudinaryConfig.ts
│   └── dbConnect.ts
├── middlewares/             # Express error handlers, auth & upload middlewares
├── modules/                 # Feature-based domain modules
│   ├── about/
│   ├── blog/
│   ├── brands/
│   ├── contact-messages/
│   ├── home/
│   ├── projects/
│   ├── services/
│   ├── settings/
│   ├── statistics/
│   ├── testimonials/
│   └── users/
├── utils/                   # Shared helpers, email service, app error classes
├── server.ts                # Application entry point & route definitions
├── tsconfig.json            # TypeScript configuration
├── package.json
└── vercel.json              # Vercel serverless deployment config
```

---

## 🔌 API Endpoints Summary

All routes are prefixed with `/api`:

| Base Endpoint | Description |
| :--- | :--- |
| `/api/users` | Authentication, user profile, password reset |
| `/api/projects` | Portfolio projects CRUD |
| `/api/services` | Offered services CRUD |
| `/api/blog` | Blog posts management |
| `/api/brands` | Client and partner brands |
| `/api/testimonials` | Client testimonials |
| `/api/statistics` | Achievements & statistics |
| `/api/about` | About page content |
| `/api/home` | Home page section content |
| `/api/settings` | Platform settings |
| `/api/contact-messages` | Inquiries & admin email replies |

---

## 🔑 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server
PORT=3301
NODE_ENV=development
BASE_URL=http://localhost:3301

# Database
MONGO_URL=your_mongodb_connection_string

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# JWT Authentication
JWT_SECRET_KEY=your_jwt_secret_key
JWT_EXPIRE_TIME=60d

# Email Service (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_SENDER=Yamuj
```

---

## 📦 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Yarn](https://yarnpkg.com/) or `npm`

### Installation

1. Clone the repository:
   ```bash
   git clone git@github.com:yamujsite-cpu/yamuj-nodejs-app.git
   cd yamuj-nodejs-app
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Setup environment variables:
   - Create `.env` using the template provided above.

### Available Scripts

- **Development Mode** (with hot reload via `tsx watch`):
  ```bash
  yarn dev
  ```

- **TypeScript Compilation**:
  ```bash
  yarn build
  ```

- **Production Mode**:
  ```bash
  yarn start
  ```

- **Linting**:
  ```bash
  yarn lint
  ```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
