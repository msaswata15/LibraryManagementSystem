
package com.app.library.controller;


import com.app.library.model.User;
import com.app.library.model.BorrowingRecord;
import com.app.library.service.UserService;
import com.app.library.service.BorrowingRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/users")
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private BorrowingRecordService borrowingRecordService;

    @GetMapping
    public List<User> getAllUsers() {
        return userService.findAllUsers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> user = userService.findUserById(id);
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/overdue-notifications")
    public List<BorrowingRecord> getOverdueNotifications(@PathVariable Long id) {
        return borrowingRecordService.getOverdueBorrowingsForMember(id);
    }

    @GetMapping("/borrowing/{borrowingId}/fine")
    public ResponseEntity<Double> getFineForBorrowing(@PathVariable Long borrowingId, @RequestParam(defaultValue = "2.0") double dailyFine) {
        Optional<BorrowingRecord> recordOpt = borrowingRecordService.findBorrowingById(borrowingId);
        if (recordOpt.isPresent()) {
            double fine = borrowingRecordService.calculateFine(recordOpt.get(), dailyFine);
            return ResponseEntity.ok(fine);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.saveUser(user);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        return userService.findUserById(id)
                .map(user -> {
                    user.setName(userDetails.getName());
                    user.setUsername(userDetails.getUsername());
                    user.setPassword(userDetails.getPassword());
                    user.setRole(userDetails.getRole());
                    user.setEmail(userDetails.getEmail());
                    user.setPhoneNumber(userDetails.getPhoneNumber());
                    user.setStartDate(userDetails.getStartDate());
                    user.setEndDate(userDetails.getEndDate());
                    return ResponseEntity.ok(userService.saveUser(user));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        return userService.findUserById(id)
                .map(user -> {
                    userService.deleteUser(id);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
