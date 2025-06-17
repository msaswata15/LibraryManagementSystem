package com.app.library.controller;

import com.app.library.model.Book;
import com.app.library.model.Member;
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

@RestController
@RequestMapping("/api")
public class LibraryController {

    // Create a logger instance
    private static final Logger logger = LoggerFactory.getLogger(LibraryController.class);

    @Autowired
    private LibraryService libraryService;

    // ==================== Book Endpoints ====================

    // Get all books
    @GetMapping("/books")
    public ResponseEntity<List<Book>> getAllBooks() {
        List<Book> books = libraryService.getAllBooks();
        logger.info("The list of books returned"+books);
        return new ResponseEntity<>(books, HttpStatus.OK);
    }

    // Get a book by ID
    @GetMapping("/books/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable Long id) {
        Optional<Book> book = libraryService.getBookById(id);
        logger.info("The book returned"+book);
        return book.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Add a new book
    @PostMapping("/books")
    public ResponseEntity<Book> addBook(@RequestBody Book book) {
        libraryService.addBook(book);
        logger.info("The book was added");
        return new ResponseEntity<>(book, HttpStatus.CREATED);
    }

    // Update a book
    @PutMapping("/books/{id}")
    public ResponseEntity<Book> updateBook(@PathVariable Long id, @RequestBody Book updatedBook) {
        if (!libraryService.getBookById(id).isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        updatedBook.setId(id);
        libraryService.updateBook(updatedBook);
        logger.info("The book has been updated "+updatedBook);
        return new ResponseEntity<>(updatedBook, HttpStatus.OK);
    }

    // Delete a book
    @DeleteMapping("/books/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        if (!libraryService.getBookById(id).isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        libraryService.deleteBook(id);
        logger.info("The book has been deleted ");
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // ==================== Member Endpoints ====================

    // Get all members
    @GetMapping("/members")
    public ResponseEntity<List<Member>> getAllMembers() {
        List<Member> members = libraryService.getAllMembers();
        logger.info("The members in the system " + members);
        return new ResponseEntity<>(members, HttpStatus.OK);
    }

    // Get a member by ID
    @GetMapping("/members/{id}")
    public ResponseEntity<Member> getMemberById(@PathVariable Long id) {
        Optional<Member> member = libraryService.getMemberById(id);
        logger.info("The member you retrieved "+member);
        return member.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Add a new member
    @PostMapping("/members")
    public ResponseEntity<Member> addMember(@RequestBody Member member) {
        libraryService.addMember(member);
        logger.info("The member has been added ");
        return new ResponseEntity<>(member, HttpStatus.CREATED);
    }

    // Update a member
    @PutMapping("/members/{id}")
    public ResponseEntity<Member> updateMember(@PathVariable Long id, @RequestBody Member updatedMember) {
        if (!libraryService.getMemberById(id).isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        updatedMember.setId(id);
        libraryService.updateMember(updatedMember);
        logger.info("The member has been updated "+updatedMember);
        return new ResponseEntity<>(updatedMember, HttpStatus.OK);
    }

    // Delete a member
    @DeleteMapping("/members/{id}")
    public ResponseEntity<Void> deleteMember(@PathVariable Long id) {
        if (!libraryService.getMemberById(id).isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        libraryService.deleteMember(id);
        logger.info("The member has been deleted "+id);
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

    // Borrow a book
    @PostMapping("/borrow")
    public ResponseEntity<BorrowingRecord> borrowBook(@RequestBody BorrowingRecord record) {
        // Set borrow date and due date (e.g., due date = borrow date + 14 days)
        record.setBorrowDate(LocalDate.now());
        record.setDueDate(LocalDate.now().plusDays(14));
        libraryService.borrowBook(record);
        logger.info("The book has been borrowed "+record);
        return new ResponseEntity<>(record, HttpStatus.CREATED);
    }

    // Return a book
    @PutMapping("/return/{recordId}")
    public ResponseEntity<Void> returnBook(@PathVariable Long recordId) {
        libraryService.returnBook(recordId, LocalDate.now());
        logger.info("The book has been retrieved "+recordId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}