package com.safapp.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class FilmeDTO {
    private Long id;
    private String titulo;
    private String genero;
    private Integer ano;
    private String sinopse;
    private String duracao;
    private String classificacao;
    private BigDecimal preco;
    private boolean disponivel;
    private String urlTrailer;
    private String imagemUrl;
}