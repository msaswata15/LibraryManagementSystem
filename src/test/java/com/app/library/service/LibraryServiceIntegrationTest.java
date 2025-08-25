package com.app.library.service;

import com.app.library.model.Book;
import com.app.library.model.BorrowingRecord;
import com.app.library.model.User;
import com.app.library.repository.BookRepository;
import com.app.library.repository.BorrowingRecordRepository;
import com.app.library.repository.MemberRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@SpringBootTest
@Transactional
class LibraryServiceIntegrationTest {

    @Autowired
    private LibraryService libraryService;
    @Autowired
    private BookRepository bookRepository;
    @Autowired
    private MemberRepository memberRepository; // still named MemberRepository but stores User
    @Autowired
    private BorrowingRecordRepository borrowingRecordRepository;

    @Test
    void borrowAndReturnFlow() {
        Book book = new Book("Test Book","Author",2024,"Fiction",2);
        book = bookRepository.save(book);

        User user = new User();
        user.setName("Alice");
        user = memberRepository.save(user);

        BorrowingRecord record = new BorrowingRecord();
        record.setBook(book);
        record.setMember(user);
        record.setBorrowDate(LocalDate.now());
        record.setDueDate(LocalDate.now().plusDays(14));

        BorrowingRecord saved = libraryService.borrowBook(record);
        Assertions.assertNotNull(saved.getId());
        Assertions.assertEquals(1, bookRepository.findById(book.getId()).get().getAvailableCopies());

        BorrowingRecord returned = libraryService.returnBook(saved.getId(), LocalDate.now().plusDays(2));
        Assertions.assertNotNull(returned.getReturnDate());
        Assertions.assertEquals(2, bookRepository.findById(book.getId()).get().getAvailableCopies());
    }
}
