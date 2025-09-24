package com.safapp.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Data
@Entity
@Table(name = "clientes")
@PrimaryKeyJoinColumn(name = "usuario_id")
public class Cliente extends Usuario {
    private String telefone;
    
    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL)
    private List<Aluguel> alugueis;
    
    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL)
    private List<Pagamento> pagamentos;
}