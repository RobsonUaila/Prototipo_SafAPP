package com.safapp.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AluguelRequest {
    private Long filmeId;
    private Integer diasAluguel;
    private LocalDateTime dataFim;
}