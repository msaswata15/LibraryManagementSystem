package com.app.library.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.app.library.model.Member;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    // Custom queries if needed
}
