package com.app.library.service;

import com.app.library.model.Book;
import com.app.library.model.Member;
import com.app.library.model.BorrowingRecord;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

class LibraryServiceTest {

    private LibraryService libraryService;

    @BeforeEach
    void setUp() {
        libraryService = new LibraryService();
    }

    @Test
    void testAddBookGeneratesId() {
        Book book = new Book("Test Title", "Test Author", 2023, "Fiction", 5);
        
        libraryService.addBook(book);
        
        assertNotNull(book.getId());
        assertEquals(1L, book.getId());
        assertEquals(1, libraryService.getAllBooks().size());
    }

    @Test
    void testAddMemberGeneratesId() {
        Member member = new Member("John Doe", "john@example.com", "123-456-7890", 
                                 LocalDate.now(), LocalDate.now().plusYears(1));
        
        libraryService.addMember(member);
        
        assertNotNull(member.getId());
        assertEquals(1L, member.getId());
        assertEquals(1, libraryService.getAllMembers().size());
    }

    @Test
    void testBorrowBookSuccess() {
        // Setup
        Book book = new Book("Test Book", "Author", 2023, "Fiction", 2);
        Member member = new Member("John Doe", "john@example.com", "123-456-7890", 
                                 LocalDate.now(), LocalDate.now().plusYears(1));
        
        libraryService.addBook(book);
        libraryService.addMember(member);
        
        BorrowingRecord record = new BorrowingRecord();
        record.setBook(book);
        record.setMember(member);
        record.setBorrowDate(LocalDate.now());
        record.setDueDate(LocalDate.now().plusDays(14));
        
        // Test
        libraryService.borrowBook(record);
        
        // Verify
        assertNotNull(record.getId());
        assertEquals(1L, record.getId());
        assertEquals(1, libraryService.getAllBorrowingRecords().size());
        assertEquals(1, book.getAvailableCopies()); // Should decrease from 2 to 1
    }

    @Test
    void testBorrowBookWithInvalidBook() {
        Member member = new Member("John Doe", "john@example.com", "123-456-7890", 
                                 LocalDate.now(), LocalDate.now().plusYears(1));
        libraryService.addMember(member);
        
        Book nonExistentBook = new Book("Non-existent", "Author", 2023, "Fiction", 1);
        
        BorrowingRecord record = new BorrowingRecord();
        record.setBook(nonExistentBook);
        record.setMember(member);
        
        assertThrows(IllegalArgumentException.class, () -> {
            libraryService.borrowBook(record);
        });
    }

    @Test
    void testBorrowBookWithNoAvailableCopies() {
        Book book = new Book("Test Book", "Author", 2023, "Fiction", 0); // No copies available
        Member member = new Member("John Doe", "john@example.com", "123-456-7890", 
                                 LocalDate.now(), LocalDate.now().plusYears(1));
        
        libraryService.addBook(book);
        libraryService.addMember(member);
        
        BorrowingRecord record = new BorrowingRecord();
        record.setBook(book);
        record.setMember(member);
        
        assertThrows(IllegalStateException.class, () -> {
            libraryService.borrowBook(record);
        });
    }

    @Test
    void testReturnBookSuccess() {
        // Setup: Create and borrow a book
        Book book = new Book("Test Book", "Author", 2023, "Fiction", 1);
        Member member = new Member("John Doe", "john@example.com", "123-456-7890", 
                                 LocalDate.now(), LocalDate.now().plusYears(1));
        
        libraryService.addBook(book);
        libraryService.addMember(member);
        
        BorrowingRecord record = new BorrowingRecord();
        record.setBook(book);
        record.setMember(member);
        record.setBorrowDate(LocalDate.now());
        record.setDueDate(LocalDate.now().plusDays(14));
        
        libraryService.borrowBook(record);
        assertEquals(0, book.getAvailableCopies()); // Should be 0 after borrowing
        
        // Test: Return the book
        libraryService.returnBook(record.getId(), LocalDate.now());
        
        // Verify
        assertNotNull(record.getReturnDate());
        assertEquals(1, book.getAvailableCopies()); // Should increase back to 1
    }

    @Test
    void testReturnBookAlreadyReturned() {
        // Setup: Create, borrow, and return a book
        Book book = new Book("Test Book", "Author", 2023, "Fiction", 1);
        Member member = new Member("John Doe", "john@example.com", "123-456-7890", 
                                 LocalDate.now(), LocalDate.now().plusYears(1));
        
        libraryService.addBook(book);
        libraryService.addMember(member);
        
        BorrowingRecord record = new BorrowingRecord();
        record.setBook(book);
        record.setMember(member);
        record.setBorrowDate(LocalDate.now());
        record.setDueDate(LocalDate.now().plusDays(14));
        
        libraryService.borrowBook(record);
        libraryService.returnBook(record.getId(), LocalDate.now());
        
        // Test: Try to return the same book again
        assertThrows(IllegalStateException.class, () -> {
            libraryService.returnBook(record.getId(), LocalDate.now());
        });
    }

    @Test
    void testReturnBookWithInvalidId() {
        assertThrows(IllegalArgumentException.class, () -> {
            libraryService.returnBook(999L, LocalDate.now());
        });
    }
}