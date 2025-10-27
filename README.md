# Video Call Backend

A NestJS backend application for managing authentication and meeting history for the video call application.

## Features

- **User Authentication**: JWT-based authentication with registration and login
- **Meeting Management**: Create, join, start, and end meetings
- **Meeting History**: Track and display meeting history for users
- **Database Integration**: PostgreSQL database with TypeORM
- **Security**: Password hashing, CORS configuration, and input validation

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT with Passport
- **Validation**: Class-validator
- **Language**: TypeScript

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

## Installation

1. Clone the repository and navigate to the backend directory:
```bash
cd video-call-backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```env
# Database
DATABASE_URL=

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server
PORT=3001
NODE_ENV=development
```

4. Start the development server:
```bash
npm run start:dev
```

The server will start on `http://localhost:3001`

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/profile` - Get user profile (requires authentication)

### Users
- `POST /users` - Register new user
- `GET /users/profile` - Get user profile (requires authentication)
- `PATCH /users/profile` - Update user profile (requires authentication)
- `DELETE /users/profile` - Delete user account (requires authentication)

### Meetings
- `POST /meetings` - Create new meeting (requires authentication)
- `GET /meetings` - Get user's meetings (requires authentication)
- `GET /meetings/history` - Get meeting history (requires authentication)
- `GET /meetings/:id` - Get specific meeting (requires authentication)
- `PATCH /meetings/:id` - Update meeting (requires authentication)
- `POST /meetings/:id/join` - Join meeting (requires authentication)
- `POST /meetings/:id/start` - Start meeting (requires authentication)
- `POST /meetings/:id/end` - End meeting (requires authentication)
- `DELETE /meetings/:id` - Delete meeting (requires authentication)

## Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `email` (String, Unique)
- `password` (String, Hashed)
- `name` (String)
- `avatar` (String, Optional)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

### Meetings Table
- `id` (UUID, Primary Key)
- `title` (String)
- `description` (String, Optional)
- `callId` (String)
- `status` (Enum: scheduled, ongoing, completed, cancelled)
- `startTime` (Timestamp, Optional)
- `endTime` (Timestamp, Optional)
- `duration` (Integer, minutes)
- `participantCount` (Integer)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)
- `host` (Foreign Key to Users)
- `participants` (Many-to-Many with Users)

## Development

### Available Scripts

- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode with hot reload
- `npm run start:debug` - Start in debug mode
- `npm run build` - Build the application
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:cov` - Run tests with coverage

### Project Structure

```
src/
├── auth/                 # Authentication module
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   ├── guards/           # JWT auth guard
│   └── strategies/       # JWT strategy
├── users/                # Users module
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── users.module.ts
│   ├── user.entity.ts
│   └── dto/              # Data transfer objects
├── meetings/             # Meetings module
│   ├── meetings.controller.ts
│   ├── meetings.service.ts
│   ├── meetings.module.ts
│   ├── meeting.entity.ts
│   └── dto/              # Data transfer objects
├── config/               # Configuration files
├── app.module.ts         # Root module
└── main.ts              # Application entry point
```

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- CORS configuration for frontend communication
- Input validation with class-validator
- SQL injection protection with TypeORM
- Environment variable configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.

