package com.prajnan.grievance.controller;

import com.prajnan.grievance.model.Grievance;
import com.prajnan.grievance.model.User;
import com.prajnan.grievance.repository.UserRepository;
import com.prajnan.grievance.service.GrievanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/grievances")
// Allow both common frontend ports (3000 for React, 5173 for Vite) just in case
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class GrievanceController {

    @Autowired
    private GrievanceService service;

    @Autowired
    private UserRepository userRepository; // Connects to the User table

    // --- USER ENDPOINTS (Login & Register) ---

    @PostMapping("/register")
    public User register(@RequestBody User newUser) {
        // Check if email already exists
        if (userRepository.findByEmail(newUser.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        if (newUser.getId() == null || newUser.getId().isEmpty()) {
            newUser.setId(java.util.UUID.randomUUID().toString());
        }

        // 3. Save to MySQL
        return userRepository.save(newUser);
    }

    @PostMapping("/login")
    public User login(@RequestBody User loginRequest) {
        // Find user by email
        Optional<User> user = userRepository.findByEmail(loginRequest.getEmail());

        // Check password (In real apps, use hashing!)
        if (user.isPresent() && user.get().getPassword().equals(loginRequest.getPassword())) {
            return user.get();
        }
        throw new RuntimeException("Invalid credentials");
    }

    // --- GRIEVANCE ENDPOINTS ---

    @PostMapping("/add")
    public String addGrievance(@RequestBody Grievance grievance) {
        service.saveGrievance(grievance);
        return "New grievance added successfully";
    }

    @GetMapping("/getAll")
    public List<Grievance> getAllGrievances() {
        return service.getAllGrievances();
    }

    // Add Update endpoint for Admin actions (Resolved/Escalated)
    @PutMapping("/update/{id}")
    public Grievance updateGrievance(@PathVariable Long id, @RequestBody Grievance updates) {
        return service.updateGrievance(id, updates);
    }
}