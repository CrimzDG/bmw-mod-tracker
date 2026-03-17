package com.bmwtracker.repository;

import com.bmwtracker.model.Mod;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ModRepository extends JpaRepository<Mod, String> {
    List<Mod> findByCarIdOrderBySortOrderAscCreatedAtAsc(String carId);
    Optional<Mod> findByIdAndCarId(String id, String carId);
}
