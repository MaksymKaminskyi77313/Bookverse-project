package com.example.backend.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.BorrowedBookDTO;
import com.example.backend.model.Book;
import com.example.backend.model.BorrowedBook;
import com.example.backend.repository.BookRepository;
import com.example.backend.repository.BorrowedBookRepository;

@RestController
@RequestMapping("/borrow")
@CrossOrigin(origins = {
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "https://bookverseproject-alpha.vercel.app"
})
public class BorrowedBookController {

    private final BorrowedBookRepository repo;
    private final BookRepository bookRepo;

    public BorrowedBookController(BorrowedBookRepository repo, BookRepository bookRepo) {
        this.repo = repo;
        this.bookRepo = bookRepo;
    }

    @PostMapping
    public BorrowedBook borrow(@RequestBody BorrowedBook request) {
        request.setBorrowDate(LocalDate.now());
        return repo.save(request);
    }

    @GetMapping("/user/{userId}")
    public List<BorrowedBookDTO> getUserBooks(@PathVariable Long userId) {

        List<BorrowedBook> list = repo.findByUserId(userId);

        return list.stream().map(b -> {
            Book book = bookRepo.findById(b.getBookId()).orElse(null);

            BorrowedBookDTO dto = new BorrowedBookDTO();
            dto.id = b.getId();
            dto.userId = b.getUserId();
            dto.bookId = b.getBookId();
            dto.borrowDate = b.getBorrowDate();

            if (book != null) {
                dto.title = book.getTitle();
                dto.author = book.getAuthor();
                dto.image = book.getImage();
            }

            return dto;
        }).toList();
    }

    @DeleteMapping("/{id}")
    public void deleteBorrow(@PathVariable Long id) {
        repo.deleteById(id);
    }
}