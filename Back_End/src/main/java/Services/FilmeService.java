package com.safapp.service;

import com.safapp.dto.FilmeDTO;
import com.safapp.model.Filme;
import com.safapp.repository.FilmeRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FilmeService {
    private final FilmeRepository filmeRepository;

    public FilmeService(FilmeRepository filmeRepository) {
        this.filmeRepository = filmeRepository;
    }

    public List<FilmeDTO> listarTodos() {
        return filmeRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<FilmeDTO> listarDisponiveis() {
        return filmeRepository.findByDisponivelTrue().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<FilmeDTO> pesquisarFilmes(String termo) {
        return filmeRepository.pesquisarFilmes(termo).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<FilmeDTO> filtrarPorGenero(String genero) {
        return filmeRepository.findByGeneroContainingIgnoreCase(genero).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public FilmeDTO buscarPorId(Long id) {
        Filme filme = filmeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Filme não encontrado"));
        return convertToDTO(filme);
    }

    public FilmeDTO salvar(Filme filme) {
        Filme saved = filmeRepository.save(filme);
        return convertToDTO(saved);
    }

    public void deletar(Long id) {
        filmeRepository.deleteById(id);
    }

    private FilmeDTO convertToDTO(Filme filme) {
        FilmeDTO dto = new FilmeDTO();
        dto.setId(filme.getId());
        dto.setTitulo(filme.getTitulo());
        dto.setGenero(filme.getGenero());
        dto.setAno(filme.getAno());
        dto.setSinopse(filme.getSinopse());
        dto.setDuracao(filme.getDuracao());
        dto.setClassificacao(filme.getClassificacao());
        dto.setPreco(filme.getPreco());
        dto.setDisponivel(filme.isDisponivel());
        dto.setUrlTrailer(filme.getUrlTrailer());
        dto.setImagemUrl(filme.getImagemUrl());
        return dto;
    }
}