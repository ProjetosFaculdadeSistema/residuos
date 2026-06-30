package br.edu.ifpr.bsi.residuos.dto;

public record VeiculoResponseDTO(
        Long codigo,
        String placa,
        String modelo,
        String tipo,
        Double capacidade,
        Integer ano,
        String foto
) {}
