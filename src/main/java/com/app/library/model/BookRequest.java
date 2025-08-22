package com.app.library.model;

import jakarta.persistence.*;

@Entity
public class BookRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long bookId;
    private String username;
    private boolean notified; // true if user has been notified of availability

    public BookRequest() {}

    public BookRequest(Long bookId, String username) {
        this.bookId = bookId;
        this.username = username;
        this.notified = false;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getBookId() { return bookId; }
    public void setBookId(Long bookId) { this.bookId = bookId; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public boolean isNotified() { return notified; }
    public void setNotified(boolean notified) { this.notified = notified; }
}
