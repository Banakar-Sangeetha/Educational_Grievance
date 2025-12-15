package com.prajnan.grievance.controller;

import com.prajnan.grievance.model.Grievance;
import com.prajnan.grievance.service.GrievanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/grievances")
@CrossOrigin(origins = "http://localhost:3000") // Allow frontend access
public class GrievanceController {
    @Autowired
    private GrievanceService service;

    @PostMapping("/add")
    public String addGrievance(@RequestBody Grievance grievance) {
        service.saveGrievance(grievance);
        return "New grievance added successfully";
    }

    @GetMapping("/getAll")
    public List<Grievance> getAllGrievances() {
        return service.getAllGrievances();
    }
}