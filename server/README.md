# Backend Server Setup

This is the backend server for the Personal Expense Tracker application using MongoDB Atlas.

## 📁 Project Structure

```
server/
├── config/
│   └── database.js         # MongoDB connection configuration
├── controllers/
│   └── transactionController.js  # Transaction business logic
├── models/
│   └── Transaction.js      # Transaction data model
├── routes/
│   └── transactions.js     # API route definitions
└── server.js              # Express server entry point
```

## 🔐 Environment Variables

The following environment variables are configured in the `.env` file:

```env
# MongoDB Configuration
MONGODB_USERNAME=expenseFlow
MONGODB_PASSWORD=DGgvPnM3knkTX9ll
MONGODB_URI=mongodb+srv://expenseFlow:DGgvPnM3knkTX9ll@cluster0.prxjz.mongodb.net/expenseTrackerDB?retryWrites=true&w=majority&appName=Cluster0

# Backend Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
VITE_API_URL=http://localhost:5000/api
```

## 🚀 Running the Backend

### Start the server in production mode:
```bash
npm run server
```

### Start the server in development mode (with auto-reload):
```bash
npm run server:dev
```

The server will start on `http://localhost:5000`

## 📡 API Endpoints

### Health Check
- **GET** `/health` - Check if the server is running

### Transactions

#### Get all transactions
- **GET** `/api/transactions?userId={userId}`
- Query parameters:
  - `userId` (required): User ID
  - `category` (optional): Filter by category
  - `startDate` (optional): Filter from date
  - `endDate` (optional): Filter to date

#### Get single transaction
- **GET** `/api/transactions/:id?userId={userId}`
- Parameters:
  - `id` (path): Transaction ID
  - `userId` (query): User ID

#### Create transaction
- **POST** `/api/transactions`
- Body:
```json
{
  "userId": "user123",
  "type": "expense",
  "amount": 50.00,
  "category": "Food",
  "description": "Lunch",
  "date": "2025-11-13"
}
```

#### Update transaction
- **PUT** `/api/transactions/:id`
- Body:
```json
{
  "userId": "user123",
  "amount": 60.00,
  "description": "Updated lunch"
}
```

#### Delete transaction
- **DELETE** `/api/transactions/:id?userId={userId}`
- Parameters:
  - `id` (path): Transaction ID
  - `userId` (query): User ID

#### Get statistics
- **GET** `/api/transactions/stats?userId={userId}`
- Query parameters:
  - `userId` (required): User ID
  - `startDate` (optional): Filter from date
  - `endDate` (optional): Filter to date

## 🗄️ Database Schema

### Transactions Collection

```javascript
{
  _id: ObjectId,
  userId: String,
  type: String,           // 'income' or 'expense'
  amount: Number,
  category: String,
  description: String,
  date: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔧 Technologies Used

- **Express.js** - Web framework
- **MongoDB** - Database (via MongoDB Atlas)
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management
- **nodemon** - Development auto-reload

## 🔒 Security Notes

- MongoDB credentials are stored in `.env` file (not committed to git)
- CORS is configured to only allow requests from the frontend URL
- Input validation is performed on all endpoints
- User ID is required for all data operations to ensure data isolation

## 📝 Usage with Frontend

The frontend can use the API service located at `src/services/api.ts`:

```typescript
import api from '@/services/api';

// Get transactions
const transactions = await api.transactions.getAll(userId);

// Create transaction
await api.transactions.create({
  userId: 'user123',
  type: 'expense',
  amount: 50,
  category: 'Food',
  description: 'Lunch',
  date: '2025-11-13'
});

// Get statistics
const stats = await api.transactions.getStats(userId);
```

## 🧪 Testing the API

You can test the API using curl or Postman:

```bash
# Health check
curl http://localhost:5000/health

# Get transactions
curl http://localhost:5000/api/transactions?userId=test123

# Create transaction
curl -X POST http://localhost:5000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test123",
    "type": "expense",
    "amount": 50,
    "category": "Food",
    "description": "Lunch",
    "date": "2025-11-13"
  }'
```

## 🚦 Running Both Frontend and Backend

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
npm run server:dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173` and will connect to the backend at `http://localhost:5000`.
