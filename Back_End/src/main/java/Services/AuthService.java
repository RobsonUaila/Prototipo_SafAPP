package com.safapp.service;

import com.safapp.dto.AuthRequest;
import com.safapp.dto.AuthResponse;
import com.safapp.model.Usuario;
import com.safapp.repository.UsuarioRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, 
                      JwtService jwtService, AuthenticationManager authenticationManager) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse authenticate(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getSenha())
        );
        
        Usuario usuario = (Usuario) authentication.getPrincipal();
        String jwt = jwtService.generateToken(usuario);
        
        return new AuthResponse(jwt, usuario);
    }

    public boolean registerCliente(Usuario cliente) {
        if (usuarioRepository.existsByEmail(cliente.getEmail())) {
            return false;
        }
        
        cliente.setSenha(passwordEncoder.encode(cliente.getSenha()));
        cliente.setTipo(Usuario.TipoUsuario.CLIENTE);
        usuarioRepository.save(cliente);
        
        return true;
    }
}