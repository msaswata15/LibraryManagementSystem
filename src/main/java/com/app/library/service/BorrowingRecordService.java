package com.app.library.service;

import com.app.library.model.BorrowingRecord;
import com.app.library.repository.BorrowingRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BorrowingRecordService {
    @Autowired
    private BorrowingRecordRepository borrowingRecordRepository;

    public List<BorrowingRecord> findAllBorrowings() {
        return borrowingRecordRepository.findAll();
    }

    public Optional<BorrowingRecord> findBorrowingById(Long id) {
        return borrowingRecordRepository.findById(id);
    }

    public BorrowingRecord saveBorrowing(BorrowingRecord record) {
        return borrowingRecordRepository.save(record);
    }

    public void deleteBorrowing(Long id) {
        borrowingRecordRepository.deleteById(id);
    }
}
