
package com.app.library.service;

import com.app.library.model.Book;
import com.app.library.model.Member;
import com.app.library.model.BorrowingRecord;
import com.app.library.repository.BookRepository;
import com.app.library.repository.MemberRepository;
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
    private MemberRepository memberRepository;
    @Autowired
    private BorrowingRecordRepository borrowingRecordRepository;




    // ==================== Member Methods ====================

    public List<Member> getAllMembers() {
        return memberRepository.findAll();
    }

    public Optional<Member> getMemberById(Long id) {
        return memberRepository.findById(id);
    }

    public Member addMember(Member member) {
        return memberRepository.save(member);
    }

    public Member updateMember(Member updatedMember) {
        return memberRepository.save(updatedMember);
    }

    public void deleteMember(Long id) {
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
    public void borrowBook(BorrowingRecord record) {
        // Validate that book exists and has available copies
        Book book = record.getBook();
        if (book == null || book.getId() == null) {
            throw new IllegalArgumentException("Book or Book ID cannot be null");
        }
        
        // Find the actual book in our storage by ID
    Optional<Book> actualBook = bookRepository.findById(book.getId());
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
    throw new UnsupportedOperationException("Implement using repository");
    }

    // Return a book (update the borrowing record with the return date)
    public void returnBook(Long recordId, LocalDate returnDate) {
        throw new UnsupportedOperationException("Implement using repository");
    }
}