package com.bmwtracker.controller;

import com.bmwtracker.dto.AppDtos.*;
import com.bmwtracker.service.ModService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cars/{carId}/mods")
public class ModController {

    private final ModService modService;

    public ModController(ModService modService) {
        this.modService = modService;
    }

    @GetMapping
    public ResponseEntity<List<ModResponse>> getMods(@PathVariable String carId,
                                                     @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(modService.getMods(carId, user.getUsername()));
    }

    @PostMapping
    public ResponseEntity<ModResponse> createMod(@PathVariable String carId,
                                                 @Valid @RequestBody ModRequest req,
                                                 @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(modService.createMod(carId, req, user.getUsername()));
    }

    @PutMapping("/{modId}")
    public ResponseEntity<ModResponse> updateMod(@PathVariable String carId,
                                                 @PathVariable String modId,
                                                 @Valid @RequestBody ModRequest req,
                                                 @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(modService.updateMod(carId, modId, req, user.getUsername()));
    }

    @PatchMapping("/{modId}/status")
    public ResponseEntity<ModResponse> updateStatus(@PathVariable String carId,
                                                    @PathVariable String modId,
                                                    @RequestBody ModStatusUpdate req,
                                                    @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(modService.updateModStatus(carId, modId, req, user.getUsername()));
    }

    @DeleteMapping("/{modId}")
    public ResponseEntity<Void> deleteMod(@PathVariable String carId,
                                          @PathVariable String modId,
                                          @AuthenticationPrincipal UserDetails user) {
        modService.deleteMod(carId, modId, user.getUsername());
        return ResponseEntity.noContent().build();
    }
}
