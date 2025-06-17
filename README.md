# Library Management System

A Spring Boot application for managing a library's books, members, and borrowing records.

## Features

* Book Management (add, update, delete, search books)
* Member Management (register, update, remove members)
* Borrowing System (check out books, return books, track due dates)
* RESTful API endpoints for all operations

## Technologies

* Java 17
* Spring Boot
* Spring Data JPA
* H2 Database (can be configured for other databases)
* Maven

## Getting Started

### Prerequisites

* Java 17 or higher
* Maven 3.6 or higher

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
```

2. Navigate to the project directory:
```bash
cd library
```

3. Build the project:
```bash
./mvnw clean install
```

4. Run the application:
```bash
./mvnw spring-boot:run
```

The application will start running at `http://localhost:8080`

## API Endpoints

### Books
* GET `/api/books` - Get all books
* GET `/api/books/{id}` - Get book by ID
* POST `/api/books` - Add a new book
* PUT `/api/books/{id}` - Update a book
* DELETE `/api/books/{id}` - Delete a book

### Members
* GET `/api/members` - Get all members
* GET `/api/members/{id}` - Get member by ID
* POST `/api/members` - Register a new member
* PUT `/api/members/{id}` - Update member information
* DELETE `/api/members/{id}` - Remove a member

### Borrowing
* POST `/api/borrow` - Borrow a book
* PUT `/api/return/{id}` - Return a book
* GET `/api/borrowing-records` - Get all borrowing records
* GET `/api/borrowing-records/member/{id}` - Get member's borrowing history

## Database Configuration

The application uses H2 database by default. The database configuration can be found in `src/main/resources/application.properties`.

## Project Structure

```
src/
├── main/
│   ├── java/
│   │   └── com/app/library/
│   │       ├── controller/
│   │       ├── model/
│   │       └── service/
│   └── resources/
│       └── application.properties
└── test/
    └── java/
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
