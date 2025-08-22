package com.app.library.controller;


import com.app.library.model.BookRequest;
import com.app.library.service.BookRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/request-book")
public class BookRequestController {
    @Autowired
    private BookRequestService bookRequestService;

    @PostMapping
    public ResponseEntity<String> requestBook(@RequestBody BookRequestDto request) {
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

    // DTO for book request
    public static class BookRequestDto {
        public Long bookId;
        public String username;
    }
}
