package com.app.library.service;

import com.app.library.model.Book;
import com.app.library.model.User;
import com.app.library.model.BorrowingRecord;
import com.app.library.repository.BookRepository;
import com.app.library.repository.UserRepository;
import com.app.library.repository.BorrowingRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class LibraryService {
    @Autowired
    private BookRepository bookRepository;
    @Autowired
    private UserRepository memberRepository; // TODO: rename variable to userRepository in later cleanup
    @Autowired
    private BorrowingRecordRepository borrowingRecordRepository;

    // ==================== User Methods ====================
    public List<User> getAllUsers() {
        return memberRepository.findAll();
    }
    
    public Optional<User> getUserById(Long id) {
        return memberRepository.findById(id);
    }
    
    public User addUser(User user) {
        return memberRepository.save(user);
    }

    public User updateUser(User user) {
        return memberRepository.save(user);
    }

    public void deleteUser(Long id) {
        memberRepository.deleteById(id);
    }

    // ==================== BorrowingRecord Methods ====================

    public List<BorrowingRecord> getAllBorrowingRecords() {
        return borrowingRecordRepository.findAll();
    }

    public Optional<BorrowingRecord> getBorrowingRecordById(Long id) {
        return borrowingRecordRepository.findById(id);
    }

    public BorrowingRecord addBorrowingRecord(BorrowingRecord record) {
        return borrowingRecordRepository.save(record);
    }

    public BorrowingRecord updateBorrowingRecord(BorrowingRecord record) {
        return borrowingRecordRepository.save(record);
    }

    public void deleteBorrowingRecord(Long id) {
        borrowingRecordRepository.deleteById(id);
    }
    

    // Borrow a book (create a new borrowing record)
    public BorrowingRecord borrowBook(BorrowingRecord record) {
        // Validate that book exists and has available copies
        Book book = record.getBook();
        if (book == null || book.getId() == null) {
            throw new IllegalArgumentException("Book or Book ID cannot be null");
        }

        Optional<Book> actualBook = bookRepository.findById(book.getId());
        if (actualBook.isEmpty()) {
            throw new IllegalArgumentException("Book does not exist");
        }
        book = actualBook.get();
        if (book.getAvailableCopies() <= 0) {
            throw new IllegalStateException("No available copies for this book");
        }

        // Validate that user exists
        User member = record.getMember();
        if (member == null || member.getId() == null) {
            throw new IllegalArgumentException("Member or Member ID cannot be null");
        }

        Optional<User> actualMember = getUserById(member.getId());
        if (actualMember.isEmpty()) {
            throw new IllegalArgumentException("Member does not exist");
        }

        // Decrement available copies and persist book
        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepository.save(book);

        // Persist borrowing record
        record.setBook(book);
        record.setMember(actualMember.get());
        if (record.getBorrowDate() == null) {
            record.setBorrowDate(LocalDate.now());
        }
        if (record.getDueDate() == null) {
            record.setDueDate(record.getBorrowDate().plusDays(14));
        }
        return borrowingRecordRepository.save(record);
    }

    // Return a book (update the borrowing record with the return date)
    public BorrowingRecord returnBook(Long recordId, LocalDate returnDate) {
        Optional<BorrowingRecord> recordOpt = borrowingRecordRepository.findById(recordId);
        if (recordOpt.isEmpty()) {
            throw new IllegalArgumentException("Borrowing record not found");
        }
        BorrowingRecord record = recordOpt.get();
        if (record.getReturnDate() != null) {
            throw new IllegalStateException("Book already returned");
        }
        // Set return date
        record.setReturnDate(returnDate != null ? returnDate : LocalDate.now());
        // Increment available copies
        Book book = record.getBook();
        if (book != null) {
            book.setAvailableCopies(book.getAvailableCopies() + 1);
            bookRepository.save(book);
        }
        return borrowingRecordRepository.save(record);
    }
}