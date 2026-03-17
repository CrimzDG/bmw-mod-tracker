package com.bmwtracker.service;

import com.bmwtracker.dto.AppDtos.*;
import com.bmwtracker.model.Mod;
import com.bmwtracker.repository.CarRepository;
import com.bmwtracker.repository.ModRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ModService {

    private final ModRepository modRepository;
    private final CarRepository carRepository;

    public ModService(ModRepository modRepository, CarRepository carRepository) {
        this.modRepository = modRepository;
        this.carRepository = carRepository;
    }

    public List<ModResponse> getMods(String carId, String userId) {
        carRepository.findByIdAndOwnerId(carId, userId)
                .orElseThrow(() -> new EntityNotFoundException("Car not found"));
        return modRepository.findByCarIdOrderBySortOrderAscCreatedAtAsc(carId)
                .stream().map(this::toResponse).toList();
    }

    @Transactional
    public ModResponse createMod(String carId, ModRequest req, String userId) {
        var car = carRepository.findByIdAndOwnerId(carId, userId)
                .orElseThrow(() -> new EntityNotFoundException("Car not found"));
        var mod = Mod.builder()
                .title(req.title())
                .description(req.description())
                .status(req.status() != null ? req.status() : Mod.Status.WISHLIST)
                .estimatedCost(req.estimatedCost())
                .actualCost(req.actualCost())
                .vendor(req.vendor())
                .car(car)
                .build();
        return toResponse(modRepository.save(mod));
    }

    @Transactional
    public ModResponse updateMod(String carId, String modId, ModRequest req, String userId) {
        carRepository.findByIdAndOwnerId(carId, userId)
                .orElseThrow(() -> new EntityNotFoundException("Car not found"));
        var mod = modRepository.findByIdAndCarId(modId, carId)
                .orElseThrow(() -> new EntityNotFoundException("Mod not found"));
        mod.setTitle(req.title());
        mod.setDescription(req.description());
        if (req.status() != null) mod.setStatus(req.status());
        mod.setEstimatedCost(req.estimatedCost());
        mod.setActualCost(req.actualCost());
        mod.setVendor(req.vendor());
        return toResponse(modRepository.save(mod));
    }

    @Transactional
    public ModResponse updateModStatus(String carId, String modId, ModStatusUpdate req, String userId) {
        carRepository.findByIdAndOwnerId(carId, userId)
                .orElseThrow(() -> new EntityNotFoundException("Car not found"));
        var mod = modRepository.findByIdAndCarId(modId, carId)
                .orElseThrow(() -> new EntityNotFoundException("Mod not found"));
        mod.setStatus(req.status());
        return toResponse(modRepository.save(mod));
    }

    @Transactional
    public void deleteMod(String carId, String modId, String userId) {
        carRepository.findByIdAndOwnerId(carId, userId)
                .orElseThrow(() -> new EntityNotFoundException("Car not found"));
        var mod = modRepository.findByIdAndCarId(modId, carId)
                .orElseThrow(() -> new EntityNotFoundException("Mod not found"));
        modRepository.delete(mod);
    }

    private ModResponse toResponse(Mod m) {
        return new ModResponse(m.getId(), m.getTitle(), m.getDescription(), m.getStatus(),
                m.getEstimatedCost(), m.getActualCost(), m.getVendor(), m.getSortOrder(),
                m.getCar().getId(), m.getCreatedAt(), m.getUpdatedAt());
    }
}
