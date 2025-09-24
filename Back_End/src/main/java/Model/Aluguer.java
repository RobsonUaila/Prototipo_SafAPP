package com.safapp.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "alugueis")
public class Aluguel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;
    
    @ManyToOne
    @JoinColumn(name = "filme_id")
    private Filme filme;
    
    private LocalDateTime dataInicio;
    private LocalDateTime dataFim;
    private LocalDateTime dataDevolucao;
    
    @Enumerated(EnumType.STRING)
    private StatusAluguel status;
    
    private BigDecimal valor;
    
    @OneToOne(mappedBy = "aluguel", cascade = CascadeType.ALL)
    private Pagamento pagamento;
    
    @PrePersist
    protected void onCreate() {
        dataInicio = LocalDateTime.now();
        status = StatusAluguel.ATIVO;
    }
    
    public enum StatusAluguel {
        ATIVO, CONCLUIDO, ATRASADO, CANCELADO
    }
}