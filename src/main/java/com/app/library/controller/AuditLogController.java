package com.app.library.controller;

import com.app.library.model.AuditLog;
import com.app.library.service.AuditLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/audit-logs")
public class AuditLogController {
    @Autowired
    private AuditLogService auditLogService;

    @GetMapping("/user/{userId}")
    public List<AuditLog> getLogsForUser(@PathVariable Long userId) {
        return auditLogService.getLogsForUser(userId);
    }
}
