package com.prajnan.grievance.controller;

import com.prajnan.grievance.model.Grievance;
import com.prajnan.grievance.model.User;
import com.prajnan.grievance.repository.UserRepository;
import com.prajnan.grievance.service.EmailService;
import com.prajnan.grievance.service.GrievanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/grievances")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class GrievanceController {

    @Autowired
    private GrievanceService service;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    // --- AUTH / REGISTRATION ENDPOINTS ---

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User newUser) {
        if (userRepository.findByEmail(newUser.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("{\"message\": \"Email already exists\"}");
        }

        if (newUser.getId() == null || newUser.getId().isEmpty()) {
            newUser.setId(UUID.randomUUID().toString());
        }

        // Default role logic can be handled here or frontend
        if (newUser.getRole() == null || newUser.getRole().isEmpty()) {
            newUser.setRole("STUDENT");
        }

        try {
            newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));
            User savedUser = userRepository.save(newUser);
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"message\": \"Database error during registration\"}");
        }
    }

    // ... inside GrievanceController class ...

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        // 1. CHECK DATABASE FIRST
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            // Return 404 if email doesn't exist
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("{\"message\":\"Email not found in database\"}");
        }

        User user = userOpt.get();

        // 2. GENERATE OTP
        String otp = String.valueOf(new Random().nextInt(900000) + 100000);
        user.setResetToken(otp);
        user.setTokenExpiry(LocalDateTime.now().plusMinutes(10));
        userRepository.save(user);

        // 3. SEND EMAIL
        try {
            emailService.sendOtpEmail(email, otp);
            return ResponseEntity.ok("{\"message\": \"OTP sent to email\"}");
        } catch (Exception e) {
            // If email fails (Auth error), return 500 but log the error
            System.err.println("Email send failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"message\": \"Failed to send email. Check backend console for OTP.\"}");
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");
        String newPassword = request.get("newPassword");

        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getResetToken() != null
                    && user.getResetToken().equals(otp)
                    && user.getTokenExpiry().isAfter(LocalDateTime.now())) {

                user.setPassword(passwordEncoder.encode(newPassword));
                user.setResetToken(null);
                user.setTokenExpiry(null);
                userRepository.save(user);

                return ResponseEntity.ok("{\"message\": \"Password updated successfully\"}");
            }
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"message\": \"Invalid or expired OTP\"}");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        Optional<User> user = userRepository.findByEmail(loginRequest.getEmail());

        if (user.isPresent()) {
            User dbUser = user.get();
            boolean passwordMatch = passwordEncoder.matches(loginRequest.getPassword(), dbUser.getPassword());
            boolean roleMatch = loginRequest.getRole().equalsIgnoreCase(dbUser.getRole());

            if (passwordMatch) {
                if (roleMatch) {
                    return ResponseEntity.ok(dbUser);
                } else {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body("{\"message\": \"Role Mismatch: You are registered as " + dbUser.getRole() + "\"}");
                }
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("{\"message\": \"Invalid credentials\"}");
    }

    // --- GRIEVANCE ENDPOINTS ---

    @PostMapping(value = "/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addGrievance(
            @RequestParam("description") String description,
            @RequestParam("category") String category,
            @RequestParam("userId") String userId,
            @RequestParam("userName") String userName,
            @RequestParam(value = "file", required = false) MultipartFile file
    ) {
        try {
            Grievance g = new Grievance();
            g.setDescription(description);
            g.setCategory(category);
            g.setUserId(userId);
            g.setUserName(userName);
            g.setStatus("PENDING");

            // Simple logic: if category is academic -> assign FACULTY, else -> ADMIN
            if ("ACADEMIC".equalsIgnoreCase(category) || "FACULTY".equalsIgnoreCase(category)) {
                g.setAssignedRole("FACULTY");
            } else {
                g.setAssignedRole("ADMIN");
            }

            if (file != null && !file.isEmpty()) {
                g.setFileName(file.getOriginalFilename());
                g.setFileType(file.getContentType());
                g.setFileData(file.getBytes());
            }

            service.saveGrievance(g);
            return ResponseEntity.ok("{\"message\": \"Grievance submitted successfully\"}");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error saving grievance: " + e.getMessage());
        }
    }

    @GetMapping("/getAll")
    public List<Grievance> getAllGrievances() {
        return service.getAllGrievances();
    }

    @PutMapping("/update/{id}")
    public Grievance updateGrievance(@PathVariable Long id, @RequestBody Grievance updates) {
        return service.updateGrievance(id, updates);
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<byte[]> downloadFile(@PathVariable Long id) {
        Grievance g = service.getGrievanceById(id);

        if (g == null || g.getFileData() == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + g.getFileName() + "\"")
                .contentType(MediaType.parseMediaType(g.getFileType()))
                .body(g.getFileData());
    }

    // --- NEW: USER MANAGEMENT ENDPOINTS ---

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable String id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok("{\"message\": \"User deleted successfully\"}");
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable String id, @RequestBody Map<String, String> request) {
        String newRole = request.get("role");
        return userRepository.findById(id)
                .map(user -> {
                    user.setRole(newRole);
                    userRepository.save(user);
                    return ResponseEntity.ok("{\"message\": \"Role updated successfully\"}");
                })
                .orElse(ResponseEntity.notFound().build());
    }
}