package com.app.library.service;

import com.app.library.model.BookRequest;
import com.app.library.repository.BookRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookRequestService {
    @Autowired
    private BookRequestRepository bookRequestRepository;

    public BookRequest saveRequest(BookRequest request) {
        return bookRequestRepository.save(request);
    }

    public List<BookRequest> getPendingRequestsForBook(Long bookId) {
        return bookRequestRepository.findByBookIdAndNotifiedFalse(bookId);
    }

    public List<BookRequest> getPendingRequestsForUser(String username) {
        return bookRequestRepository.findByUsernameAndNotifiedFalse(username);
    }

    public void markAsNotified(BookRequest request) {
        request.setNotified(true);
        bookRequestRepository.save(request);
    }
}
