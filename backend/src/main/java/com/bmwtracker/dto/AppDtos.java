package com.bmwtracker.dto;

import com.bmwtracker.model.Mod;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.Instant;

public class AppDtos {

    // --- Car ---
    public record CarRequest(
            @NotBlank @Size(min = 1, max = 100) String name,
            String model,
            Integer year,
            String color,
            String notes
    ) {}

    public record CarResponse(
            String id,
            String name,
            String model,
            Integer year,
            String color,
            String notes,
            Instant createdAt,
            long modCount
    ) {}

    // --- Mod ---
    public record ModRequest(
            @NotBlank @Size(min = 1, max = 200) String title,
            String description,
            Mod.Status status,
            Double estimatedCost,
            Double actualCost,
            String vendor
    ) {}

    public record ModStatusUpdate(Mod.Status status) {}

    public record ModResponse(
            String id,
            String title,
            String description,
            Mod.Status status,
            Double estimatedCost,
            Double actualCost,
            String vendor,
            Integer sortOrder,
            String carId,
            Instant createdAt,
            Instant updatedAt
    ) {}
}
