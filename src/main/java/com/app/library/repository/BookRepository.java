
package com.app.library.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.app.library.model.Book;


@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    // Search by title (case-insensitive)
    List<Book> findByTitleContainingIgnoreCase(String title);

    // Search by author (case-insensitive)
    List<Book> findByAuthorContainingIgnoreCase(String author);

    // Search by title and author (case-insensitive)
    List<Book> findByTitleContainingIgnoreCaseAndAuthorContainingIgnoreCase(String title, String author);
}
