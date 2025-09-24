package com.safapp.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "usuarios")
@Inheritance(strategy = InheritanceType.JOINED)
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Nome é obrigatório")
    private String nome;
    
    @Email(message = "Email deve ser válido")
    @NotBlank(message = "Email é obrigatório")
    @Column(unique = true)
    private String email;
    
    @NotBlank(message = "Senha é obrigatória")
    private String senha;
    
    @Enumerated(EnumType.STRING)
    private TipoUsuario tipo;
    
    private LocalDateTime dataCriacao;
    
    private boolean ativo;
    
    @PrePersist
    protected void onCreate() {
        dataCriacao = LocalDateTime.now();
        ativo = true;
    }
    
    public enum TipoUsuario {
        CLIENTE, FUNCIONARIO, GESTOR
    }
}