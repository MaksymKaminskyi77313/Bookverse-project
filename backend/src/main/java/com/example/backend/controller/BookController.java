package com.example.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
    
import com.example.backend.model.Book;
import com.example.backend.repository.BookRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/books")
@CrossOrigin("*")
public class BookController {

    private final BookRepository repository;
        public BookController(BookRepository repository) {
        this.repository = repository;
    }

    @GetMapping
        public List<Book> getBooks() {
        return repository.findAll();
    }


    @PostMapping
    public Book addBook(@Valid @RequestBody Book book) {
    return repository.save(book);
    }


    @GetMapping("/{id}")
        public ResponseEntity<Book> getBook(@PathVariable Long id) {
        return repository.findById(id)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
    }


     @DeleteMapping("/{id}")
        public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        if (!repository.existsById(id)) return ResponseEntity.notFound().build();
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }


    @PutMapping("/{id}")
        public ResponseEntity<Book> updateBook(
        @PathVariable Long id,
        @RequestBody Book updatedBook) {

    return repository.findById(id)
            .map(book -> {
            book.setTitle(updatedBook.getTitle());
            book.setAuthor(updatedBook.getAuthor());
            book.setImage(updatedBook.getImage());
            book.setCategory(updatedBook.getCategory());
            book.setDescription(updatedBook.getDescription());
            book.setType(updatedBook.getType());

            Book saved = repository.save(book);
            return ResponseEntity.ok(saved);
            }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
        public List<Book> searchBooks(@RequestParam String query) {
    return repository.search(query);
    }


    @GetMapping("/category/{category}")
        public List<Book> getByCategory(@PathVariable String category) {
    return repository.findByCategory(category);
    }


    @GetMapping("/type/{type}")
    public List<Book> getByType(@PathVariable String type) {
    return repository.findByType(type);
    }


}