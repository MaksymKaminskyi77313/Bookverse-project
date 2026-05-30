package com.example.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.backend.model.Book;

public interface BookRepository extends JpaRepository<Book, Long> {

    List<Book> findByCategory(String category);

    List<Book> findByType(String type);

    @Query("SELECT book FROM Book book WHERE " +
           "LOWER(book.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(book.author) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Book> search(@Param("query") String query);
}