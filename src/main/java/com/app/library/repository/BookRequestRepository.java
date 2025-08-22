package com.app.library.repository;

import com.app.library.model.BookRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRequestRepository extends JpaRepository<BookRequest, Long> {
    List<BookRequest> findByBookIdAndNotifiedFalse(Long bookId);
    List<BookRequest> findByUsernameAndNotifiedFalse(String username);
}
