package com.app.library.controller;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.app.library.model.User;
import com.app.library.service.CustomUserDetailsService;
import com.app.library.util.JwtUtil;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
    private static final Logger log = LoggerFactory.getLogger(AuthController.class);
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private CustomUserDetailsService userDetailsService;
    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
    log.debug("Register attempt for username: {}", user.getUsername());
    return ResponseEntity.ok(userDetailsService.save(user));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        try {
            log.debug("Login attempt for username: {}", user.getUsername());
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword())
            );
            log.debug("Authentication success for username: {}", user.getUsername());
            
            // Get the user from database to include role info
            User dbUser = userDetailsService.findByUsername(user.getUsername());
            String token = jwtUtil.generateToken(user.getUsername());
            
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("role", dbUser.getRole());
            response.put("id", dbUser.getId());
            response.put("username", dbUser.getUsername());
            
            return ResponseEntity.ok(response);
        } catch (AuthenticationException e) {
            log.warn("Authentication failed for username: {} - {}", user.getUsername(), e.getMessage());
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }
}
