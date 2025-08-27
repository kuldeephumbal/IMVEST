# IMVEST Server

Investment Management System Backend API

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally or cloud instance)
- Gmail account with App Password

### Installation

1. **Clone and install dependencies**
```bash
npm install
```

2. **Run setup script**
```bash
npm run setup
```

3. **Configure environment variables**
Edit `.env` file and update:
```env
MONGO_URI=mongodb://localhost:27017/IMVEST
JWT_SECRET=your_secure_jwt_secret
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
```

4. **Test email configuration** (optional)
```bash
npm run test:email
```

5. **Start the server**
```bash
npm start
# or for development
npm run dev
```

## 📧 Email Configuration

### Gmail App Password Setup
1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to [Google Account Settings](https://myaccount.google.com/)
   - Security → 2-Step Verification → App passwords
   - Select "Mail" and "Other (Custom name)"
   - Name it "IMVEST Server" and generate
   - Copy the 16-character password
3. **Use the App Password** in `EMAIL_PASSWORD` (not your regular Gmail password)

📖 **Detailed Setup Guide**: See [GMAIL_SETUP.md](docs/GMAIL_SETUP.md) for complete instructions.

## 🔧 API Endpoints

### Base URL: `http://localhost:5000/api`

### Authentication
- `POST /admin/login` - Admin login
- `POST /client/login` - Client login
- `POST /admin/forgot-password` - Forgot password
- `POST /admin/verify-otp` - Verify OTP
- `POST /admin/reset-password` - Reset password

### Client Management
- `POST /client/register` - Client registration
- `GET /client/pending-approvals` - Get pending approvals
- `POST /client/:id/approve` - Approve/decline client

### Admin Dashboard
- `GET /admin/dashboard/overview` - Dashboard overview
- `GET /admin/dashboard/financial-reports` - Financial reports
- `GET /admin/dashboard/referral-analytics` - Referral analytics
- `GET /admin/dashboard/system-health` - System health

### Communication
- `GET /communication/messages` - Get messages
- `POST /communication/messages` - Send message
- `GET /communication/messages/unread-count` - Unread count

## 📁 Project Structure

```
server/
├── config/          # Database and multer configuration
├── controllers/     # Route controllers
├── middleware/      # Authentication and request middleware
├── models/          # MongoDB schemas
├── routes/          # API routes
├── utils/           # Utility functions (email, audit)
├── uploads/         # File uploads
├── scripts/         # Setup and utility scripts
└── docs/            # API documentation
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Comprehensive audit logging
- Rate limiting (to be implemented)
- Input validation and sanitization

## 📊 Audit Logging

All admin actions are automatically logged with:
- User agent information
- IP address
- Request ID for tracing
- Action details and metadata
- Timestamps

## 🐛 Troubleshooting

### Email Not Sending
1. ✅ Check Gmail credentials in `.env`
2. ✅ Ensure 2FA is enabled and App Password is used (not regular password)
3. ✅ Verify App Password is 16 characters long
4. ✅ Check Gmail's App Password settings
5. ✅ See [GMAIL_SETUP.md](docs/GMAIL_SETUP.md) for detailed troubleshooting

### MongoDB Connection Issues
1. Ensure MongoDB is running
2. Check `MONGO_URI` in `.env`
3. Verify network connectivity

### File Upload Issues
1. Check `uploads/` directory permissions
2. Ensure multer configuration is correct
3. Verify file size limits

## 📝 Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `MONGO_URI` | MongoDB connection string | Yes | `mongodb://localhost:27017/IMVEST` |
| `JWT_SECRET` | JWT signing secret | Yes | `your_secure_jwt_secret_here` |
| `EMAIL_USER` | Gmail address | Yes | `imvest.system@gmail.com` |
| `EMAIL_PASSWORD` | Gmail App Password (16 chars) | Yes | `abcd efgh ijkl mnop` |
| `PORT` | Server port | No | `5000` (default) |
| `NODE_ENV` | Environment | No | `development` (default) |

## 🔄 Development

### Running Tests
```bash
# Add test scripts when implemented
npm test
```

### Code Quality
```bash
# Add linting when implemented
npm run lint
```

## 📄 License

This project is proprietary software for IMVEST. 