package com.safapp.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "gestores")
@PrimaryKeyJoinColumn(name = "usuario_id")
public class Gestor extends Usuario {
    private String departamento;
}