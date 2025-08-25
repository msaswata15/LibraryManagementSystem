package com.app.library.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.app.library.model.BorrowingRecord;

@Repository
public interface BorrowingRecordRepository extends JpaRepository<BorrowingRecord, Long> {
    // Top N most borrowed books (by book id)
    @Query("SELECT br.book.id FROM BorrowingRecord br WHERE br.book IS NOT NULL GROUP BY br.book.id ORDER BY COUNT(br.book.id) DESC")
    List<Long> findMostBorrowedBookIds();

    // Find genres of books borrowed by a user
    @Query("SELECT DISTINCT br.book.genre FROM BorrowingRecord br WHERE br.member.id = :memberId AND br.book IS NOT NULL AND br.book.genre IS NOT NULL")
    List<String> findBorrowedGenresByMember(@Param("memberId") Long memberId);

    // Find book ids by genre
    @Query("SELECT DISTINCT br.book.id FROM BorrowingRecord br WHERE br.book.genre = :genre AND br.book IS NOT NULL")
    List<Long> findBookIdsByGenre(@Param("genre") String genre);
    
    // Find overdue borrowings for a user
    @Query("SELECT br FROM BorrowingRecord br WHERE br.member.id = :memberId AND br.returnDate IS NULL AND br.dueDate < CURRENT_DATE")
    List<BorrowingRecord> findOverdueByMember(@Param("memberId") Long memberId);
}
