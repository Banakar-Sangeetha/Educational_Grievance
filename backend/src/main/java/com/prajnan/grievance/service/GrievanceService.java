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
}