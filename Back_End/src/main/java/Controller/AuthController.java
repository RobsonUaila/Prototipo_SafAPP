package com.safapp.controller;

import com.safapp.dto.AuthRequest;
import com.safapp.dto.AuthResponse;
import com.safapp.model.Cliente;
import com.safapp.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = authService.authenticate(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/registro")
    public ResponseEntity<?> register(@Valid @RequestBody Cliente cliente) {
        boolean success = authService.registerCliente(cliente);
        if (success) {
            return ResponseEntity.ok("Cliente registrado com sucesso");
        }
        return ResponseEntity.badRequest().body("Email já está em uso");
    }
}