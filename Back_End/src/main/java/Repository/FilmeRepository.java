package com.safapp.repository;

import com.safapp.model.Filme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FilmeRepository extends JpaRepository<Filme, Long> {
    List<Filme> findByDisponivelTrue();
    List<Filme> findByGeneroContainingIgnoreCase(String genero);
    List<Filme> findByTituloContainingIgnoreCase(String titulo);
    List<Filme> findByAno(Integer ano);
    
    @Query("SELECT f FROM Filme f WHERE f.titulo LIKE %:termo% OR f.genero LIKE %:termo% OR f.elenco LIKE %:termo%")
    List<Filme> pesquisarFilmes(@Param("termo") String termo);
}