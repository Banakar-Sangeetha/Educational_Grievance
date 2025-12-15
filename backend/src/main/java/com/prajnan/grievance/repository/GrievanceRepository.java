package com.prajnan.grievance.repository;

import com.prajnan.grievance.model.Grievance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GrievanceRepository extends JpaRepository<Grievance, Long> {
}