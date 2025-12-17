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

    public Grievance saveGrievance(Grievance grievance) {
        return repository.save(grievance);
    }

    public List<Grievance> getAllGrievances() {
        return repository.findAll();
    }

    // New method needed for downloads
    public Grievance getGrievanceById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public Grievance updateGrievance(Long id, Grievance updates) {
        return repository.findById(id)
                .map(g -> {
                    if (updates.getStatus() != null) g.setStatus(updates.getStatus());
                    if (updates.getResolutionNotes() != null) g.setResolutionNotes(updates.getResolutionNotes());
                    return repository.save(g);
                })
                .orElse(null);
    }
}