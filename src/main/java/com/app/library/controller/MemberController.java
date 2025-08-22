// ...existing code...
package com.app.library.controller;

import com.app.library.model.Member;
import com.app.library.model.BorrowingRecord;
import com.app.library.service.MemberService;
import com.app.library.service.BorrowingRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/members")
public class MemberController {
    // --- Fine Calculation Endpoint ---
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
    @Autowired
    private MemberService memberService;

    @Autowired
    private BorrowingRecordService borrowingRecordService;
    // --- Overdue Notification Endpoint ---
    @GetMapping("/{id}/overdue-notifications")
    public List<BorrowingRecord> getOverdueNotifications(@PathVariable Long id) {
        return borrowingRecordService.getOverdueBorrowingsForMember(id);
    }

    @GetMapping
    public List<Member> getAllMembers() {
        return memberService.findAllMembers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Member> getMemberById(@PathVariable Long id) {
        Optional<Member> member = memberService.findMemberById(id);
        return member.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Member createMember(@RequestBody Member member) {
        return memberService.saveMember(member);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Member> updateMember(@PathVariable Long id, @RequestBody Member memberDetails) {
        return memberService.findMemberById(id)
                .map(member -> {
                    member.setName(memberDetails.getName());
                    member.setEmail(memberDetails.getEmail());
                    return ResponseEntity.ok(memberService.saveMember(member));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMember(@PathVariable Long id) {
        return memberService.findMemberById(id)
                .map(member -> {
                    memberService.deleteMember(id);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
