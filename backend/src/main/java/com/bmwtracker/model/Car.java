package com.bmwtracker.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cars")
public class Car {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column
    private String model;

    @Column
    private Integer year;

    @Column
    private String color;

    @Column
    private String notes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @OneToMany(mappedBy = "car", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Mod> mods = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
    }

    // Getters
    public String getId() { return id; }
    public String getName() { return name; }
    public String getModel() { return model; }
    public Integer getYear() { return year; }
    public String getColor() { return color; }
    public String getNotes() { return notes; }
    public User getOwner() { return owner; }
    public List<Mod> getMods() { return mods; }
    public Instant getCreatedAt() { return createdAt; }

    // Setters
    public void setId(String id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setModel(String model) { this.model = model; }
    public void setYear(Integer year) { this.year = year; }
    public void setColor(String color) { this.color = color; }
    public void setNotes(String notes) { this.notes = notes; }
    public void setOwner(User owner) { this.owner = owner; }
    public void setMods(List<Mod> mods) { this.mods = mods; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    // Builder
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final Car car = new Car();
        public Builder name(String name) { car.name = name; return this; }
        public Builder model(String model) { car.model = model; return this; }
        public Builder year(Integer year) { car.year = year; return this; }
        public Builder color(String color) { car.color = color; return this; }
        public Builder notes(String notes) { car.notes = notes; return this; }
        public Builder owner(User owner) { car.owner = owner; return this; }
        public Car build() { return car; }
    }
}
