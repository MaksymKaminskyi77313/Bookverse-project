package com.example.backend.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = {
    "https://bookverseproject-alpha.vercel.app",
    "http://127.0.0.1:5500",
    "http://localhost:5500"
})
public class UserController {

    private final UserRepository repository;

    public UserController(UserRepository repository) {
        this.repository = repository;
    }
    @GetMapping
    public List<User> getAllUsers() {
        return repository.findAll();
    }
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (repository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already registered"));
        }
        if (user.getRole() == null) user.setRole("user");
        User saved = repository.save(user);
        saved.setPassword(null);  
        return ResponseEntity.ok(saved);
    }
 
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email    = body.get("email");
        String password = body.get("password");

        Optional<User> found = repository.findByEmail(email);

        if (found.isEmpty() || !found.get().getPassword().equals(password)) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid email or password"));
        }

        User user = found.get();
        user.setPassword(null); 
        return ResponseEntity.ok(user);
    }
}