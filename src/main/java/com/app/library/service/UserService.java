package com.app.library.service;

import com.app.library.model.User;
import com.app.library.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> findUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public User saveUser(User user) {
    user.setStartDate(java.time.LocalDate.now());
        if (user.getEndDate() == null) {
            if ("librarian".equalsIgnoreCase(user.getRole())) {
                user.setEndDate(user.getStartDate().plusYears(5));
            } else {
                user.setEndDate(user.getStartDate().plusYears(1));
            }
        }
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
