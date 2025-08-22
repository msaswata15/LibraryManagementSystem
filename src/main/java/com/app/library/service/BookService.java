package com.app.library.service;

import com.app.library.model.Book;
import com.app.library.repository.BookRepository;
import com.app.library.repository.BorrowingRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class BookService {
    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private BorrowingRecordRepository borrowingRecordRepository;

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
            bookRepository.findById(id).ifPresent(books::add);
            if (books.size() >= limit) break;
        }
        return books;
    }

    public List<Book> getGenreBasedRecommendations(Long memberId, int limit) {
        List<String> genres = borrowingRecordRepository.findBorrowedGenresByMember(memberId);
        Set<Long> recommendedBookIds = new LinkedHashSet<>();
        for (String genre : genres) {
            List<Long> ids = borrowingRecordRepository.findBookIdsByGenre(genre);
            recommendedBookIds.addAll(ids);
        }
        // Remove books already borrowed by the user
        // (Optional: implement if you want to avoid recommending already borrowed books)
        List<Book> books = new ArrayList<>();
        for (Long id : recommendedBookIds) {
            bookRepository.findById(id).ifPresent(books::add);
            if (books.size() >= limit) break;
        }
        return books;
    }
}
