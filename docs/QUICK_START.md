# Quick Start Guide

Get EasyBuyStore running in 5 minutes! ⚡

## Prerequisites
- Node.js (v18+) - [Download](https://nodejs.org/)
- MySQL (v8.0+) - [Download](https://www.mysql.com/downloads/)

> **Note for Windows users:** Commands are shown for both Mac/Linux and Windows. Use Command Prompt, PowerShell, or Git Bash.

## Steps

### 1. Extract & Navigate

Extract the zip file, then open Terminal/Command Prompt and navigate:

**Mac/Linux:**
```bash
cd /path/to/easybuystore-nextjs
```

**Windows:**
```cmd
cd C:\path\to\easybuystore-nextjs
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create Database

**Mac/Linux:**
```bash
mysql -u root -p
```

**Windows:**
```cmd
# If 'mysql' not found, use full path:
# "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p
mysql -u root -p
```

**Then (all platforms):**
```sql
CREATE DATABASE easybuystore;
exit;
```

### 4. Configure Environment

**Create `.env` file:**

**Mac/Linux:**
```bash
cp .env.example .env
```

**Windows:**
```cmd
copy .env.example .env
```

**Edit `.env` and set:**
```env
DATABASE_URL="mysql://root:yourpassword@localhost:3306/easybuystore"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-using-command-below"
```

**Generate secret (all platforms):**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 5. Setup Database
```bash
npx prisma generate
npx prisma db push
```

### 6. Run the App
```bash
npm run dev
```

### 7. Open Browser
Visit: **http://localhost:3000**

## Default URLs
- Customer Site: http://localhost:3000
- Admin Panel: http://localhost:3000/admin/login
- Products: http://localhost:3000/products

## Need Help?
See `SETUP_GUIDE.md` for detailed instructions.

---

**That's it! Happy coding! 🎉**
