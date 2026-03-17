package com.bmwtracker.repository;

import com.bmwtracker.model.Car;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CarRepository extends JpaRepository<Car, String> {
    List<Car> findByOwnerIdOrderByCreatedAtDesc(String ownerId);
    Optional<Car> findByIdAndOwnerId(String id, String ownerId);
}
