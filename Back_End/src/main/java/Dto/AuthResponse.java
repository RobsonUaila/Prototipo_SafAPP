package com.safapp.dto;

import com.safapp.model.Usuario;
import lombok.Data;

@Data
public class AuthResponse {
    private String token;
    private String tipo = "Bearer";
    private Long id;
    private String email;
    private String nome;
    private Usuario.TipoUsuario tipoUsuario;
    
    public AuthResponse(String token, Usuario usuario) {
        this.token = token;
        this.id = usuario.getId();
        this.email = usuario.getEmail();
        this.nome = usuario.getNome();
        this.tipoUsuario = usuario.getTipo();
    }
}