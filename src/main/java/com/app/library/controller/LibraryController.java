package com.app.library.controller;
import com.app.library.service.BookService;



import com.app.library.model.Book;
import com.app.library.model.User;
import com.app.library.model.BorrowingRecord;
import com.app.library.service.LibraryService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
@CrossOrigin(origins = "http://localhost:5173")

@RestController
@RequestMapping("/api")
public class LibraryController {
    @Autowired
    private BookService bookService;
    // ==================== Book Endpoints Proxy ====================

    // Proxy GET /api/books to /books
    @GetMapping("/books")
    public ResponseEntity<List<Book>> getAllBooksProxy() {
        return ResponseEntity.ok(bookService.findAllBooks());
    }

    // Proxy GET /api/books/{id} to /books/{id}
    @GetMapping("/books/{id}")
    public ResponseEntity<Book> getBookByIdProxy(@PathVariable Long id) {
        Optional<Book> book = bookService.findBookById(id);
        return book.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Proxy POST /api/books to /books
    @PostMapping("/books")
    public ResponseEntity<Book> createBookProxy(@RequestBody Book book) {
        Book created = bookService.saveBook(book);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // Proxy PUT /api/books/{id} to /books/{id}
    @PutMapping("/books/{id}")
    public ResponseEntity<Book> updateBookProxy(@PathVariable Long id, @RequestBody Book book) {
        Optional<Book> existing = bookService.findBookById(id);
        if (!existing.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        book.setId(id);
        Book updated = bookService.saveBook(book);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    // Proxy DELETE /api/books/{id} to /books/{id}
    @DeleteMapping("/books/{id}")
    public ResponseEntity<Void> deleteBookProxy(@PathVariable Long id) {
        Optional<Book> existing = bookService.findBookById(id);
        if (!existing.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        bookService.deleteBook(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Create a logger instance
    private static final Logger logger = LoggerFactory.getLogger(LibraryController.class);

    @Autowired
    private LibraryService libraryService;



    // ==================== User Endpoints ====================

    // Get all users
    @GetMapping("/members")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = libraryService.getAllUsers();
        logger.info("The users in the system " + users);
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    // Get a user by ID
    @GetMapping("/members/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> user = libraryService.getUserById(id);
        logger.info("The user you retrieved "+user);
        return user.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Add a new user
    @PostMapping("/members")
    public ResponseEntity<User> addUser(@RequestBody User user) {
        libraryService.addUser(user);
        logger.info("The user has been added ");
        return new ResponseEntity<>(user, HttpStatus.CREATED);
    }

    // Update a user
    @PutMapping("/members/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        if (!libraryService.getUserById(id).isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        updatedUser.setId(id);
        libraryService.updateUser(updatedUser);
        logger.info("The user has been updated "+updatedUser);
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }

    // Delete a user
    @DeleteMapping("/members/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (!libraryService.getUserById(id).isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        libraryService.deleteUser(id);
        logger.info("The user has been deleted "+id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // ==================== BorrowingRecord Endpoints ====================

    // Get all borrowing records
    @GetMapping("/borrowing-records")
    public ResponseEntity<List<BorrowingRecord>> getAllBorrowingRecords() {
        List<BorrowingRecord> records = libraryService.getAllBorrowingRecords();
        logger.info("The records has been retrieved "+records);
        return new ResponseEntity<>(records, HttpStatus.OK);
    }


    // Borrow a book (database-backed)
    @PostMapping("/borrow")
    public ResponseEntity<BorrowingRecord> borrowBook(@RequestBody BorrowingRecord record) {
        try {
            // Set borrow date and due date (e.g., due date = borrow date + 14 days)
            record.setBorrowDate(LocalDate.now());
            record.setDueDate(LocalDate.now().plusDays(14));
            BorrowingRecord saved = libraryService.addBorrowingRecord(record);
            logger.info("The book has been borrowed " + saved);
            return new ResponseEntity<>(saved, HttpStatus.CREATED);
        } catch (Exception e) {
            logger.error("Error borrowing book: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }


    // Return a book (database-backed)
    @PutMapping("/return/{recordId}")
    public ResponseEntity<BorrowingRecord> returnBook(@PathVariable Long recordId) {
        try {
            var recordOpt = libraryService.getBorrowingRecordById(recordId);
            if (recordOpt.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            BorrowingRecord record = recordOpt.get();
            if (record.getReturnDate() != null) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            record.setReturnDate(LocalDate.now());
            BorrowingRecord updated = libraryService.updateBorrowingRecord(record);
            logger.info("The book has been returned " + recordId);
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error returning book: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}