package com.bmwtracker.service;

import com.bmwtracker.dto.AppDtos.*;
import com.bmwtracker.model.Car;
import com.bmwtracker.repository.CarRepository;
import com.bmwtracker.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CarService {

    private final CarRepository carRepository;
    private final UserRepository userRepository;

    public CarService(CarRepository carRepository, UserRepository userRepository) {
        this.carRepository = carRepository;
        this.userRepository = userRepository;
    }

    public List<CarResponse> getCars(String userId) {
        return carRepository.findByOwnerIdOrderByCreatedAtDesc(userId).stream()
                .map(c -> toResponse(c, c.getMods().size()))
                .toList();
    }

    public CarResponse getCar(String carId, String userId) {
        var car = carRepository.findByIdAndOwnerId(carId, userId)
                .orElseThrow(() -> new EntityNotFoundException("Car not found"));
        return toResponse(car, car.getMods().size());
    }

    @Transactional
    public CarResponse createCar(CarRequest req, String userId) {
        var owner = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        var car = Car.builder()
                .name(req.name())
                .model(req.model())
                .year(req.year())
                .color(req.color())
                .notes(req.notes())
                .owner(owner)
                .build();
        return toResponse(carRepository.save(car), 0);
    }

    @Transactional
    public CarResponse updateCar(String carId, CarRequest req, String userId) {
        var car = carRepository.findByIdAndOwnerId(carId, userId)
                .orElseThrow(() -> new EntityNotFoundException("Car not found"));
        car.setName(req.name());
        car.setModel(req.model());
        car.setYear(req.year());
        car.setColor(req.color());
        car.setNotes(req.notes());
        return toResponse(carRepository.save(car), car.getMods().size());
    }

    @Transactional
    public void deleteCar(String carId, String userId) {
        var car = carRepository.findByIdAndOwnerId(carId, userId)
                .orElseThrow(() -> new EntityNotFoundException("Car not found"));
        carRepository.delete(car);
    }

    private CarResponse toResponse(Car c, long modCount) {
        return new CarResponse(c.getId(), c.getName(), c.getModel(), c.getYear(),
                c.getColor(), c.getNotes(), c.getCreatedAt(), modCount);
    }
}
