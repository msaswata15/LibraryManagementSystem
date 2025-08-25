package com.app.library.service;

import com.app.library.model.BorrowingRecord;
import com.app.library.repository.BorrowingRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BorrowingRecordService {
    // Fine Calculation
    public double calculateFine(BorrowingRecord record, double dailyFine) {
        if (record.getReturnDate() == null || record.getDueDate() == null) return 0.0;
        if (!record.getReturnDate().isAfter(record.getDueDate())) return 0.0;
        long overdueDays = java.time.temporal.ChronoUnit.DAYS.between(record.getDueDate(), record.getReturnDate());
        return overdueDays * dailyFine;
    }
    @Autowired
    private BorrowingRecordRepository borrowingRecordRepository;

    @Autowired
    private AuditLogService auditLogService;

    public List<BorrowingRecord> findAllBorrowings() {
        return borrowingRecordRepository.findAll();
    }

    public Optional<BorrowingRecord> findBorrowingById(Long id) {
        return borrowingRecordRepository.findById(id);
    }

    public BorrowingRecord saveBorrowing(BorrowingRecord record) {
        BorrowingRecord saved = borrowingRecordRepository.save(record);
        if (record.getId() == null) {
            // New borrow
            auditLogService.logAction(
                record.getMember() != null ? record.getMember().getId() : null,
                "BORROW",
                "Borrowed book ID: " + (record.getBook() != null ? record.getBook().getId() : null)
            );
        }
        return saved;
    }

    public void deleteBorrowing(Long id) {
        // Optionally log delete action
        borrowingRecordRepository.deleteById(id);
    }

    public void logReturnAction(BorrowingRecord record) {
        auditLogService.logAction(
            record.getMember() != null ? record.getMember().getId() : null,
            "RETURN",
            "Returned book ID: " + (record.getBook() != null ? record.getBook().getId() : null)
        );
    }

    // --- Overdue Notification Logic ---
    public List<BorrowingRecord> getOverdueBorrowingsForMember(Long memberId) {
        return borrowingRecordRepository.findOverdueByMember(memberId);
    }
}
