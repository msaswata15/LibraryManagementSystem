package com.app.library.service;

import com.app.library.model.Book;
import com.app.library.model.Member;
import com.app.library.model.BorrowingRecord;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

@Service
public class LibraryService {

    // In-memory storage using ArrayList
    private List<Book> books = new ArrayList<>();
    private List<Member> members = new ArrayList<>();
    private List<BorrowingRecord> borrowingRecords = new ArrayList<>();
    
    // Simple ID generation (for in-memory storage)
    private Long nextBookId = 1L;
    private Long nextMemberId = 1L;
    private Long nextRecordId = 1L;

    // ==================== Book Methods ====================

    // Get all books
    public List<Book> getAllBooks() {
        return books;
    }

    // Get a book by ID
    public Optional<Book> getBookById(Long id) {
        return books.stream()
                .filter(book -> book.getId().equals(id))
                .findFirst();
    }

    // Add a new book
    public void addBook(Book book) {
        book.setId(nextBookId++);
        books.add(book);
    }

    // Update a book
    public void updateBook(Book updatedBook) {
        for (int i = 0; i < books.size(); i++) {
            Book book = books.get(i);
            if (book.getId().equals(updatedBook.getId())) {
                books.set(i, updatedBook);
                break;
            }
        }
    }

    // Delete a book by ID
    public void deleteBook(Long id) {
        books.removeIf(book -> book.getId().equals(id));
    }

    // ==================== Member Methods ====================

    // Get all members
    public List<Member> getAllMembers() {
        return members;
    }

    // Get a member by ID
    public Optional<Member> getMemberById(Long id) {
        return members.stream()
                .filter(member -> member.getId().equals(id))
                .findFirst();
    }

    // Add a new member
    public void addMember(Member member) {
        member.setId(nextMemberId++);
        members.add(member);
    }

    // Update a member
    public void updateMember(Member updatedMember) {
        for (int i = 0; i < members.size(); i++) {
            Member member = members.get(i);
            if (member.getId().equals(updatedMember.getId())) {
                members.set(i, updatedMember);
                break;
            }
        }
    }

    // Delete a member by ID
    public void deleteMember(Long id) {
        members.removeIf(member -> member.getId().equals(id));
    }

    // ==================== BorrowingRecord Methods ====================

    // Get all borrowing records
    public List<BorrowingRecord> getAllBorrowingRecords() {
        return borrowingRecords;
    }

    // Borrow a book (create a new borrowing record)
    public void borrowBook(BorrowingRecord record) {
        // Validate that book exists and has available copies
        Book book = record.getBook();
        if (book == null || book.getId() == null) {
            throw new IllegalArgumentException("Book or Book ID cannot be null");
        }
        
        // Find the actual book in our storage by ID
        Optional<Book> actualBook = getBookById(book.getId());
        if (!actualBook.isPresent()) {
            throw new IllegalArgumentException("Book does not exist");
        }
        book = actualBook.get();
        record.setBook(book); // Update record with the actual book from storage
        
        // Validate that member exists
        Member member = record.getMember();
        if (member == null || member.getId() == null) {
            throw new IllegalArgumentException("Member or Member ID cannot be null");
        }
        
        // Find the actual member in our storage by ID
        Optional<Member> actualMember = getMemberById(member.getId());
        if (!actualMember.isPresent()) {
            throw new IllegalArgumentException("Member does not exist");
        }
        member = actualMember.get();
        record.setMember(member); // Update record with the actual member from storage
        
        // Check if copies are available
        if (book.getAvailableCopies() <= 0) {
            throw new IllegalStateException("No copies of this book are available");
        }
        
        // Generate ID for the borrowing record
        record.setId(nextRecordId++);
        
        // Note: Dates should be set by the controller, not here
        // This avoids duplicate date setting
        borrowingRecords.add(record);

        // Decrease the available copies of the book
        book.setAvailableCopies(book.getAvailableCopies() - 1);
    }

    // Return a book (update the borrowing record with the return date)
    public void returnBook(Long recordId, LocalDate returnDate) {
        if (recordId == null) {
            throw new IllegalArgumentException("Record ID cannot be null");
        }
        
        for (BorrowingRecord record : borrowingRecords) {
            if (record.getId() != null && record.getId().equals(recordId)) {
                // Check if book was already returned
                if (record.getReturnDate() != null) {
                    throw new IllegalStateException("Book has already been returned");
                }
                
                record.setReturnDate(returnDate);

                // Increase the available copies of the book
                Book book = record.getBook();
                if (book != null) {
                    book.setAvailableCopies(book.getAvailableCopies() + 1);
                }
                return;
            }
        }
        throw new IllegalArgumentException("Borrowing record not found");
    }
}