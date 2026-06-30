package br.edu.ifpr.bsi.residuos.dto;

public record VeiculoRequestDTO(
        String placa,
        String modelo,
        String tipo,
        Double capacidade,
        Integer ano
) {}
