package com.app.library.service;

import com.app.library.model.User;
import com.app.library.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MemberService {
    @Autowired
    private MemberRepository memberRepository;

    public List<User> findAllMembers() {
        return memberRepository.findAll();
    }

    public Optional<User> findMemberById(Long id) {
        return memberRepository.findById(id);
    }

    public User saveMember(User member) {
        return memberRepository.save(member);
    }

    public void deleteMember(Long id) {
        memberRepository.deleteById(id);
    }
}
