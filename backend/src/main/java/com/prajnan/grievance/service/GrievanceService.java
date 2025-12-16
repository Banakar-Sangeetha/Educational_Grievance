package com.prajnan.grievance.service;

import com.prajnan.grievance.model.Grievance;
import com.prajnan.grievance.repository.GrievanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GrievanceService {

    @Autowired
    private GrievanceRepository repository;

    // Save a new grievance
    public Grievance saveGrievance(Grievance grievance) {
        return repository.save(grievance);
    }

    // Get all grievances
    public List<Grievance> getAllGrievances() {
        return repository.findAll();
    }

    // Update an existing grievance (The code you provided)
    public Grievance updateGrievance(Long id, Grievance updates) {
        return repository.findById(id)
                .map(g -> {
                    // Only update status if a new one is provided
                    if (updates.getStatus() != null) {
                        g.setStatus(updates.getStatus());
                    }
                    // Only update notes if new notes are provided
                    if (updates.getResolutionNotes() != null) {
                        g.setResolutionNotes(updates.getResolutionNotes());
                    }
                    return repository.save(g);
                })
                .orElse(null); // Returns null if ID wasn't found
    }
}