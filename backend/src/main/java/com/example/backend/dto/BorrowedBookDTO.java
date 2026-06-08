package com.example.backend.dto;

import java.time.LocalDate;

public class BorrowedBookDTO {
    public Long id;
    public Long userId;
    public Long bookId;

    public String title;
    public String author;
    public String image;

    public LocalDate borrowDate;
}