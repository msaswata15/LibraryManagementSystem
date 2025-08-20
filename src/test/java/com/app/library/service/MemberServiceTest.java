package com.app.library.service;

import com.app.library.model.Member;
import com.app.library.repository.MemberRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class MemberServiceTest {
    @Mock
    private MemberRepository memberRepository;

    @InjectMocks
    private MemberService memberService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testFindMemberById() {
        Member member = new Member();
        member.setId(1L);
        member.setName("Test Member");
        when(memberRepository.findById(1L)).thenReturn(Optional.of(member));

        Optional<Member> found = memberService.findMemberById(1L);
        assertTrue(found.isPresent());
        assertEquals("Test Member", found.get().getName());
    }
}
