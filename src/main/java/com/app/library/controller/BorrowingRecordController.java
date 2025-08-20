package com.app.library.controller;

import com.app.library.model.BorrowingRecord;
import com.app.library.service.BorrowingRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/borrowings")
public class BorrowingRecordController {
    @Autowired
    private BorrowingRecordService borrowingRecordService;

    @GetMapping
    public List<BorrowingRecord> getAllBorrowings() {
        return borrowingRecordService.findAllBorrowings();
    }

    @GetMapping("/{id}")
    public ResponseEntity<BorrowingRecord> getBorrowingById(@PathVariable Long id) {
        Optional<BorrowingRecord> record = borrowingRecordService.findBorrowingById(id);
        return record.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public BorrowingRecord createBorrowing(@RequestBody BorrowingRecord record) {
        return borrowingRecordService.saveBorrowing(record);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BorrowingRecord> updateBorrowing(@PathVariable Long id, @RequestBody BorrowingRecord recordDetails) {
        return borrowingRecordService.findBorrowingById(id)
                .map(record -> {
                    // You may need to update the book/member references here as needed
                    record.setBorrowDate(recordDetails.getBorrowDate());
                    record.setReturnDate(recordDetails.getReturnDate());
                    record.setDueDate(recordDetails.getDueDate());
                    return ResponseEntity.ok(borrowingRecordService.saveBorrowing(record));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBorrowing(@PathVariable Long id) {
        return borrowingRecordService.findBorrowingById(id)
                .map(record -> {
                    borrowingRecordService.deleteBorrowing(id);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
