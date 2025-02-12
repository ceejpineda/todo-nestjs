# NestJS Todo API - Design and Implementation Documentation

## Architecture Design

### 1. Module Structure
```plaintext
src/
├── auth/              # Authentication handling
│   ├── dto/          # Data transfer objects
│   ├── guards/       # JWT guards
│   └── services/     # Auth business logic
├── user/             # User management
│   ├── dto/
│   ├── entities/
│   └── repositories/
└── task/             # Task management
    ├── dto/
    ├── entities/
    └── repositories/
```

### 2. Database Schema

#### User Entity
```typescript
User {
  id: number          // Primary Key
  username: string    // Unique
  password: string    // Hashed
  tasks: Task[]       // One-to-Many relationship
}
```

#### Task Entity
```typescript
Task {
  id: number          // Primary Key
  title: string
  description: string
  status: string      // enum: ['pending', 'in_progress', 'completed']
  userId: number      // Foreign Key
  user: User          // Many-to-One relationship
}
```

## Setup and Execution

### 1. Environment Setup

1. Install PostgreSQL:
```bash
# Download and install from
https://www.postgresql.org/download/windows/
```

2. Create database:
```sql
CREATE DATABASE todo;
```

3. Configure environment variables:
```properties
// filepath: /C:/Code/ToDo-Nestjs/todo-assignment/.env
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASS=postgres
DB_NAME=todo
JWT_SECRET=your_secure_secret
```

### 2. Project Setup

1. Install dependencies:
```bash
npm install
```

2. Run migrations:
```bash
npm run typeorm:run-migrations
```

3. Start development server:
```bash
npm run start:dev
```

## API Testing Flow

1. Create a new user:
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "password123"}'
```

2. Login to get JWT token:
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "password123"}'
```

3. Use Swagger UI:
- Navigate to `http://localhost:3000/api`
- Click "Authorize" button
- Enter JWT token: `Bearer your_token_here`

## Development Guidelines

### 1. DTOs and Validation
- Use class-validator decorators
- Implement request/response DTOs
- Add Swagger documentation

### 2. Error Handling
- Use NestJS built-in exceptions
- Implement custom exception filters
- Proper error messages and status codes

### 3. Testing
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage report
npm run test:cov
```

## Security Measures

1. Authentication:
- JWT-based authentication
- Token expiration
- Password hashing

2. Authorization:
- Route guards
- Role-based access
- User ownership validation

3. Data Validation:
- Input sanitization
- Request validation
- SQL injection prevention

## Deployment

### Development
```bash
npm run start:dev
```

### Production
```bash
npm run build
npm run start:prod
```

### Docker (Optional)
```dockerfile
// filepath: /C:/Code/ToDo-Nestjs/todo-assignment/Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "run", "start:prod"]
```

## Monitoring and Maintenance

1. Logging:
- Request/Response logging
- Error tracking
- Performance monitoring

2. Database:
- Regular backups
- Index optimization
- Query performance

3. Security:
- Regular dependency updates
- Security patches
- Token rotation