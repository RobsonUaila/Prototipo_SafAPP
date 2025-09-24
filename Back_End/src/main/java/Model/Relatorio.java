package com.safapp.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "relatorios")
public class Relatorio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String tipo; // VENDAS, ALUGUEIS, CLIENTES, etc.
    private LocalDateTime periodoInicio;
    private LocalDateTime periodoFim;
    private String dados; // JSON com os dados do relatório
    private LocalDateTime dataGeracao;
    
    @ManyToOne
    @JoinColumn(name = "gestor_id")
    private Gestor gestor;
    
    @PrePersist
    protected void onCreate() {
        dataGeracao = LocalDateTime.now();
    }
}