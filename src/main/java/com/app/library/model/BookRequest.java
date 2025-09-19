package com.app.library.model;

import jakarta.persistence.*;

@Entity
@Table(name = "book_requests")

public class BookRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "book_id")
    private Book book;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private boolean notified; // true if user has been notified of availability

    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;

    public enum Status {
        PENDING,
        APPROVED,
        REJECTED
    }


    public BookRequest() {}

    public BookRequest(Book book, User user) {
        this.book = book;
        this.user = user;
        this.notified = false;
        this.status = Status.PENDING;
    }


    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Book getBook() { return book; }
    public void setBook(Book book) { this.book = book; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public boolean isNotified() { return notified; }
    public void setNotified(boolean notified) { this.notified = notified; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
}
