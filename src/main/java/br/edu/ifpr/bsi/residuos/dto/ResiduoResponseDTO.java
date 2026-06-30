package br.edu.ifpr.bsi.residuos.dto;

public record ResiduoResponseDTO(
        Long codigo,
        String nome,
        String tipo,
        String descricao,
        String periculosidade,
        String unidadeMedida,
        Double quantidade,
        String imagem
) {}
