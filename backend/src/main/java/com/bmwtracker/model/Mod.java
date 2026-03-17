package com.bmwtracker.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "mods")
public class Mod {

    public enum Status {
        WISHLIST, PLANNED, IN_PROGRESS, DONE
    }

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.WISHLIST;

    @Column(name = "estimated_cost")
    private Double estimatedCost;

    @Column(name = "actual_cost")
    private Double actualCost;

    @Column
    private String vendor;

    @Column(name = "sort_order")
    private Integer sortOrder = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "car_id", nullable = false)
    private Car car;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
        updatedAt = Instant.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }

    // Getters
    public String getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public Status getStatus() { return status; }
    public Double getEstimatedCost() { return estimatedCost; }
    public Double getActualCost() { return actualCost; }
    public String getVendor() { return vendor; }
    public Integer getSortOrder() { return sortOrder; }
    public Car getCar() { return car; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }

    // Setters
    public void setId(String id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setDescription(String description) { this.description = description; }
    public void setStatus(Status status) { this.status = status; }
    public void setEstimatedCost(Double estimatedCost) { this.estimatedCost = estimatedCost; }
    public void setActualCost(Double actualCost) { this.actualCost = actualCost; }
    public void setVendor(String vendor) { this.vendor = vendor; }
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }
    public void setCar(Car car) { this.car = car; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    // Builder
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final Mod mod = new Mod();
        public Builder title(String title) { mod.title = title; return this; }
        public Builder description(String description) { mod.description = description; return this; }
        public Builder status(Status status) { mod.status = status; return this; }
        public Builder estimatedCost(Double estimatedCost) { mod.estimatedCost = estimatedCost; return this; }
        public Builder actualCost(Double actualCost) { mod.actualCost = actualCost; return this; }
        public Builder vendor(String vendor) { mod.vendor = vendor; return this; }
        public Builder sortOrder(Integer sortOrder) { mod.sortOrder = sortOrder; return this; }
        public Builder car(Car car) { mod.car = car; return this; }
        public Mod build() { return mod; }
    }
}
