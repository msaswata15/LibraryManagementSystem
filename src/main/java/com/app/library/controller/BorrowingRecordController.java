package com.app.library.controller;

import com.app.library.model.BorrowingRecord;
import com.app.library.model.Book;
import com.app.library.model.User;
import com.app.library.service.BorrowingRecordService;
import com.app.library.service.BookService;
import com.app.library.service.UserService;
import com.app.library.dto.BorrowingRecordRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
@CrossOrigin(origins = "http://localhost:5173")

@RestController
@RequestMapping("/borrowings")

public class BorrowingRecordController {
    @Autowired
    private BorrowingRecordService borrowingRecordService;

    @Autowired
    private BookService bookService;

    @Autowired
    private UserService userService;

    @GetMapping
    public List<BorrowingRecord> getAllBorrowings() {
        return borrowingRecordService.findAllBorrowings();
    }

    @GetMapping("/{id}")
    public ResponseEntity<BorrowingRecord> getBorrowingById(@PathVariable Long id) {
        Optional<BorrowingRecord> record = borrowingRecordService.findBorrowingById(id);
        return record.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createBorrowing(@RequestBody BorrowingRecordRequest request) {
        // Look up Book and User
        Book book = bookService.findBookById(request.getBookId()).orElse(null);
        User user = userService.findUserById(request.getUserId()).orElse(null);
        if (book == null || user == null) {
            return ResponseEntity.badRequest().body("Invalid bookId or userId");
        }
        if (book.getAvailableCopies() <= 0) {
            return ResponseEntity.badRequest().body("Book is not available");
        }
        // Decrement availableCopies and save
        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookService.saveBook(book);
        BorrowingRecord record = new BorrowingRecord();
        record.setBook(book);
        record.setMember(user);
        // Set borrowDate to now, dueDate to 1 year from now
        java.time.LocalDate now = java.time.LocalDate.now();
        record.setBorrowDate(now);
        record.setDueDate(now.plusYears(1));
        // Only set returnDate if provided (for future extensibility)
        if (request.getReturnDate() != null) {
            record.setReturnDate(request.getReturnDate());
        }
        BorrowingRecord saved = borrowingRecordService.saveBorrowing(record);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BorrowingRecord> updateBorrowing(@PathVariable Long id, @RequestBody BorrowingRecord recordDetails) {
        return borrowingRecordService.findBorrowingById(id)
                .map(record -> {
                    // If returnDate is being set (book returned), increment availableCopies
                    if (record.getReturnDate() == null && recordDetails.getReturnDate() != null) {
                        Book book = record.getBook();
                        book.setAvailableCopies(book.getAvailableCopies() + 1);
                        bookService.saveBook(book);
                    }
                    record.setBorrowDate(recordDetails.getBorrowDate());
                    record.setReturnDate(recordDetails.getReturnDate());
                    record.setDueDate(recordDetails.getDueDate());
                    return ResponseEntity.ok(borrowingRecordService.saveBorrowing(record));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBorrowing(@PathVariable Long id) {
        return borrowingRecordService.findBorrowingById(id)
                .map(record -> {
                    borrowingRecordService.deleteBorrowing(id);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
