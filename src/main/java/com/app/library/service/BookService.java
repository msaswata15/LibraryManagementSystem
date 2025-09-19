
package com.app.library.service;

import com.app.library.model.Book;
import com.app.library.repository.BookRepository;
import com.app.library.repository.BorrowingRecordRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class BookService {

        // Search books by title and/or author
        public List<Book> searchBooks(String title, String author) {
            if ((title == null || title.isEmpty()) && (author == null || author.isEmpty())) {
                return bookRepository.findAll();
            }
            if (title != null && !title.isEmpty() && author != null && !author.isEmpty()) {
                return bookRepository.findByTitleContainingIgnoreCaseAndAuthorContainingIgnoreCase(title, author);
            } else if (title != null && !title.isEmpty()) {
                return bookRepository.findByTitleContainingIgnoreCase(title);
            } else {
                return bookRepository.findByAuthorContainingIgnoreCase(author);
            }
        }
    /**
     * Returns true if the book is referenced by any borrowing records.
     */
    public boolean hasBorrowings(Long bookId) {
        // Use count query for efficiency
    return borrowingRecordRepository.existsByBook_Id(bookId);
    }
    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private BorrowingRecordRepository borrowingRecordRepository;

    @Cacheable("books")
    public List<Book> findAllBooks() {
        return bookRepository.findAll();
    }

    public Optional<Book> findBookById(Long id) {
        return bookRepository.findById(id);
    }

    public Book saveBook(Book book) {
        return bookRepository.save(book);
    }

    public void deleteBook(Long id) {
    bookRepository.deleteById(id);
    }

    // --- Recommendation Logic ---
    public List<Book> getMostBorrowedBooks(int limit) {
        List<Long> bookIds = borrowingRecordRepository.findMostBorrowedBookIds();
        List<Book> books = new ArrayList<>();
        for (Long id : bookIds) {
            if (id != null) {  // Add null check
                bookRepository.findById(id).ifPresent(books::add);
                if (books.size() >= limit) break;
            }
        }
        return books;
    }

    public List<Book> getGenreBasedRecommendations(Long memberId, int limit) {
        List<String> genres = borrowingRecordRepository.findBorrowedGenresByMember(memberId);
        Set<Long> recommendedBookIds = new LinkedHashSet<>();
        for (String genre : genres) {
            if (genre != null) {  // Add null check for genre
                List<Long> ids = borrowingRecordRepository.findBookIdsByGenre(genre);
                recommendedBookIds.addAll(ids);
            }
        }
        // Remove books already borrowed by the user
        // (Optional: implement if you want to avoid recommending already borrowed books)
        List<Book> books = new ArrayList<>();
        for (Long id : recommendedBookIds) {
            if (id != null) {  // Add null check
                bookRepository.findById(id).ifPresent(books::add);
                if (books.size() >= limit) break;
            }
        }
        return books;
    }
}
