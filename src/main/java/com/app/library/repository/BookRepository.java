package com.app.library.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.app.library.model.Book;


@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    // Custom queries if needed
}
