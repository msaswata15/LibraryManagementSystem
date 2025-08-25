
package com.app.library.controller;


import com.app.library.model.BookRequest;
import com.app.library.model.Book;
import com.app.library.service.BookRequestService;
import com.app.library.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/request-book")
public class BookRequestController {
    @Autowired
    private BookRequestService bookRequestService;

    @Autowired
    private BookService bookService;
        // Librarian: Get all pending book requests
        @GetMapping
        public ResponseEntity<?> getAllPendingRequests() {
            var requests = bookRequestService.getAllPendingRequests();
            return ResponseEntity.ok(requests);
        }


    @PostMapping
    public ResponseEntity<String> requestBook(@RequestBody BookRequestDto request) {
        Book book = bookService.findBookById(request.bookId).orElse(null);
        if (book == null) {
            return ResponseEntity.badRequest().body("Invalid bookId");
        }
        if (book.getAvailableCopies() <= 0) {
            return ResponseEntity.badRequest().body("Book is not available");
        }
        BookRequest req = new BookRequest(request.bookId, request.username);
        bookRequestService.saveRequest(req);
        return ResponseEntity.ok("Book request submitted for librarian approval.");
    }

    // Endpoint for user to check if their requested book is now available
    @GetMapping("/notifications/{username}")
    public ResponseEntity<?> checkBookAvailability(@PathVariable String username) {
        // Find all pending requests for this user
        var requests = bookRequestService.getPendingRequestsForUser(username);
        // For each, check if the book is available (simulate real-time)
        var available = new java.util.ArrayList<Long>();
        for (var req : requests) {
            // In a real app, inject BookService and check availableCopies
            // Here, just notify for demo (or you can add BookService logic)
            available.add(req.getBookId());
            bookRequestService.markAsNotified(req);
        }
        return ResponseEntity.ok(available);
    }

    // Approve a book request
    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveRequest(@PathVariable Long id) {
        var updated = bookRequestService.approveRequest(id);
        return ResponseEntity.ok(updated);
    }

    // Reject a book request
    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectRequest(@PathVariable Long id) {
        var updated = bookRequestService.rejectRequest(id);
        return ResponseEntity.ok(updated);
    }

    // DTO for book request
    public static class BookRequestDto {
        public Long bookId;
        public String username;
    }
}
