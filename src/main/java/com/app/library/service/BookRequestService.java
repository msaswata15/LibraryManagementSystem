package com.app.library.service;
import java.util.Optional;

import com.app.library.model.BookRequest;
import com.app.library.model.Book;
import com.app.library.model.User;
import com.app.library.model.BorrowingRecord;
import com.app.library.repository.BookRequestRepository;
import com.app.library.repository.BookRepository;
import com.app.library.repository.UserRepository;
import com.app.library.repository.BorrowingRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookRequestService {
    @Autowired
    private BookRequestRepository bookRequestRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BorrowingRecordRepository borrowingRecordRepository;

    public BookRequest saveRequest(BookRequest request) {
        return bookRequestRepository.save(request);
    }

    public List<BookRequest> getPendingRequestsForBook(Long bookId) {
        return bookRequestRepository.findByBookIdAndNotifiedFalse(bookId);
    }

    public List<BookRequest> getPendingRequestsForUser(String username) {
        return bookRequestRepository.findByUsernameAndNotifiedFalse(username);
    }

    public List<BookRequest> getAllPendingRequests() {
        return bookRequestRepository.findByStatus(BookRequest.Status.PENDING);
    }

    public void markAsNotified(BookRequest request) {
        request.setNotified(true);
        bookRequestRepository.save(request);
    }

    public Optional<BookRequest> findById(Long id) {
        return bookRequestRepository.findById(id);
    }

    public BookRequest approveRequest(Long id) {
        BookRequest req = bookRequestRepository.findById(id).orElseThrow();
        if (req.getBookId() != null && req.getUsername() != null) {
            Book book = bookRepository.findById(req.getBookId()).orElse(null);
            User user = userRepository.findByUsername(req.getUsername()).orElse(null);
            if (book != null && user != null && book.getAvailableCopies() > 0) {
                req.setStatus(BookRequest.Status.APPROVED);
                BookRequest savedReq = bookRequestRepository.save(req);
                // Decrement available copies
                book.setAvailableCopies(book.getAvailableCopies() - 1);
                bookRepository.save(book);
                // Create borrowing record
                BorrowingRecord record = new BorrowingRecord();
                record.setBook(book);
                record.setMember(user);
                java.time.LocalDate now = java.time.LocalDate.now();
                record.setBorrowDate(now);
                record.setDueDate(now.plusYears(1));
                borrowingRecordRepository.save(record);
                return savedReq;
            } else {
                // Not enough copies, reject the request
                req.setStatus(BookRequest.Status.REJECTED);
                return bookRequestRepository.save(req);
            }
        }
        // If book or user not found, reject
        req.setStatus(BookRequest.Status.REJECTED);
        return bookRequestRepository.save(req);
    }

    public BookRequest rejectRequest(Long id) {
        BookRequest req = bookRequestRepository.findById(id).orElseThrow();
        req.setStatus(BookRequest.Status.REJECTED);
        return bookRequestRepository.save(req);
    }
}
