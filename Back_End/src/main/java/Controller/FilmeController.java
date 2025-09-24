package com.safapp.controller;

import com.safapp.dto.FilmeDTO;
import com.safapp.model.Filme;
import com.safapp.service.FilmeService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/filmes")
@CrossOrigin(origins = "*")
public class FilmeController {
    private final FilmeService filmeService;

    public FilmeController(FilmeService filmeService) {
        this.filmeService = filmeService;
    }

    @GetMapping
    public ResponseEntity<List<FilmeDTO>> listarTodos() {
        return ResponseEntity.ok(filmeService.listarTodos());
    }

    @GetMapping("/disponiveis")
    public ResponseEntity<List<FilmeDTO>> listarDisponiveis() {
        return ResponseEntity.ok(filmeService.listarDisponiveis());
    }

    @GetMapping("/pesquisar")
    public ResponseEntity<List<FilmeDTO>> pesquisar(@RequestParam String termo) {
        return ResponseEntity.ok(filmeService.pesquisarFilmes(termo));
    }

    @GetMapping("/genero/{genero}")
    public ResponseEntity<List<FilmeDTO>> filtrarPorGenero(@PathVariable String genero) {
        return ResponseEntity.ok(filmeService.filtrarPorGenero(genero));
    }

    @GetMapping("/{id}")
    public ResponseEntity<FilmeDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(filmeService.buscarPorId(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('FUNCIONARIO') or hasRole('GESTOR')")
    public ResponseEntity<FilmeDTO> criar(@RequestBody Filme filme) {
        return ResponseEntity.ok(filmeService.salvar(filme));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('FUNCIONARIO') or hasRole('GESTOR')")
    public ResponseEntity<FilmeDTO> atualizar(@PathVariable Long id, @RequestBody Filme filme) {
        filme.setId(id);
        return ResponseEntity.ok(filmeService.salvar(filme));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('GESTOR')")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        filmeService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}