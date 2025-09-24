package com.safapp.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "pagamentos")
public class Pagamento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "aluguel_id")
    private Aluguel aluguel;
    
    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;
    
    private BigDecimal valor;
    
    @Enumerated(EnumType.STRING)
    private MetodoPagamento metodo;
    
    @Enumerated(EnumType.STRING)
    private StatusPagamento status;
    
    private LocalDateTime dataPagamento;
    private String transacaoId;
    
    @PrePersist
    protected void onCreate() {
        dataPagamento = LocalDateTime.now();
        status = StatusPagamento.PENDENTE;
    }
    
    public enum MetodoPagamento {
        CARTAO_CREDITO, CARTAO_DEBITO, PAYPAL, MBWAY, DINHEIRO
    }
    
    public enum StatusPagamento {
        PENDENTE, CONCLUIDO, FALHOU, ESTORNADO
    }
}