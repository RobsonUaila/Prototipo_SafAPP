package com.safapp.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
@Entity
@Table(name = "filmes")
public class Filme {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Título é obrigatório")
    private String titulo;
    
    private String genero;
    private Integer ano;
    private String sinopse;
    private String elenco;
    private String duracao;
    private String classificacao;
    
    @DecimalMin(value = "0.0", message = "Preço deve ser maior ou igual a zero")
    private BigDecimal preco;
    
    private boolean disponivel;
    private String urlTrailer;
    private String imagemUrl;
    
    @OneToMany(mappedBy = "filme", cascade = CascadeType.ALL)
    private List<Aluguel> alugueis;
}