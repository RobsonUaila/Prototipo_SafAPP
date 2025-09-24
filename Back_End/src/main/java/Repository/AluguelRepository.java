package com.safapp.repository;

import com.safapp.model.Aluguel;
import com.safapp.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AluguelRepository extends JpaRepository<Aluguel, Long> {
    List<Aluguel> findByCliente(Cliente cliente);
    List<Aluguel> findByDataFimBeforeAndStatus(LocalDateTime data, Aluguel.StatusAluguel status);
    
    @Query("SELECT a FROM Aluguel a WHERE a.dataFim BETWEEN :inicio AND :fim")
    List<Aluguel> findAlugueisPorPeriodo(@Param("inicio") LocalDateTime inicio, 
                                        @Param("fim") LocalDateTime fim);
}