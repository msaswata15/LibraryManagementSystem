package com.app.library.service;

import com.app.library.model.BorrowingRecord;
import com.app.library.repository.BorrowingRecordRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class BorrowingRecordServiceTest {
    @Mock
    private BorrowingRecordRepository borrowingRecordRepository;

    @InjectMocks
    private BorrowingRecordService borrowingRecordService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testFindBorrowingById() {
        BorrowingRecord record = new BorrowingRecord();
        record.setId(1L);
        record.setBorrowDate(LocalDate.now());
        when(borrowingRecordRepository.findById(1L)).thenReturn(Optional.of(record));

        Optional<BorrowingRecord> found = borrowingRecordService.findBorrowingById(1L);
        assertTrue(found.isPresent());
        assertEquals(1L, found.get().getId());
    }
}
