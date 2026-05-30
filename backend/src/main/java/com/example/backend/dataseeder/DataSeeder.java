package com.example.backend.dataseeder;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.example.backend.model.Book;
import com.example.backend.repository.BookRepository;

@Component
public class DataSeeder implements CommandLineRunner {

    private final BookRepository repository;

    public DataSeeder(BookRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) {
        if (repository.count() > 0) return;  

        repository.save(new Book(null, "Harry Potter", "J.K Rowling", "https://covers.openlibrary.org/b/id/10523338-L.jpg", "Fantasy", "A young wizard discovers his magical heritage on his eleventh birthday.", "featured"));
        repository.save(new Book(null, "The Hobbit", "Tolkien", "https://covers.openlibrary.org/b/id/11153224-L.jpg", "Fantasy", "Bilbo Baggins is whisked away on a quest to reclaim a lost treasure.", "featured"));
        repository.save(new Book(null, "Dune", "Frank Herbert", "https://covers.openlibrary.org/b/id/12606557-L.jpg", "Sci-Fi", "The story of young Paul Atreides on the desert planet Arrakis.", "featured"));
        repository.save(new Book(null, "1984", "George Orwell", "https://covers.openlibrary.org/b/id/8231856-L.jpg", "History", "Winston Smith wrestles with oppression under the ever-watchful Big Brother.", "featured"));
        repository.save(new Book(null, "Atomic Habits", "James Clear", "https://covers.openlibrary.org/b/id/240726-L.jpg", "Business", "A proven framework for improving every day through small habits.", "bestseller"));
        repository.save(new Book(null, "Rich Dad Poor Dad", "Robert Kiyosaki", "https://covers.openlibrary.org/b/id/5546156-L.jpg", "Business", "The difference between working for money and having money work for you.", "bestseller"));
        repository.save(new Book(null, "It Ends With Us", "Colleen Hoover", "https://covers.openlibrary.org/b/id/7884866-L.jpg", "Romance", "A beautiful yet heartbreaking love triangle tale.", "bestseller"));
        repository.save(new Book(null, "The Midnight Library", "Matt Haig", "https://covers.openlibrary.org/b/id/240727-L.jpg", "Psychology", "Between life and death there is a library with infinite possibilities.", "new"));
        repository.save(new Book(null, "Sapiens", "Yuval Noah Harari", "https://covers.openlibrary.org/b/id/240728-L.jpg", "History", "How one species among countless others conquered the Earth.", "new"));
        repository.save(new Book(null, "Project Hail Mary", "Andy Weir", "https://covers.openlibrary.org/b/id/240729-L.jpg", "Sci-Fi", "A last-chance mission to save humanity from an extinction-level event.", "new"));
    }
}
