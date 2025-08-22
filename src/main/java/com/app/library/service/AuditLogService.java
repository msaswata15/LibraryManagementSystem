package com.app.library.service;

import com.app.library.model.AuditLog;
import com.app.library.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuditLogService {
    @Autowired
    private AuditLogRepository auditLogRepository;

    public void logAction(Long userId, String action, String details) {
        AuditLog log = new AuditLog(userId, action, details, LocalDateTime.now());
        auditLogRepository.save(log);
    }

    public List<AuditLog> getLogsForUser(Long userId) {
        return auditLogRepository.findByUserId(userId);
    }
}
