package com.bmwtracker.controller;

import com.bmwtracker.dto.AppDtos.*;
import com.bmwtracker.service.CarService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cars")
public class CarController {

    private final CarService carService;

    public CarController(CarService carService) {
        this.carService = carService;
    }

    @GetMapping
    public ResponseEntity<List<CarResponse>> getCars(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(carService.getCars(user.getUsername()));
    }

    @GetMapping("/{carId}")
    public ResponseEntity<CarResponse> getCar(@PathVariable String carId,
                                              @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(carService.getCar(carId, user.getUsername()));
    }

    @PostMapping
    public ResponseEntity<CarResponse> createCar(@Valid @RequestBody CarRequest req,
                                                 @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(carService.createCar(req, user.getUsername()));
    }

    @PutMapping("/{carId}")
    public ResponseEntity<CarResponse> updateCar(@PathVariable String carId,
                                                 @Valid @RequestBody CarRequest req,
                                                 @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(carService.updateCar(carId, req, user.getUsername()));
    }

    @DeleteMapping("/{carId}")
    public ResponseEntity<Void> deleteCar(@PathVariable String carId,
                                          @AuthenticationPrincipal UserDetails user) {
        carService.deleteCar(carId, user.getUsername());
        return ResponseEntity.noContent().build();
    }
}
