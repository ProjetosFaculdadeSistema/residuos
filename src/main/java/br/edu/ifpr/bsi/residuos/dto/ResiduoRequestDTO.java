package br.edu.ifpr.bsi.residuos.dto;

public record ResiduoRequestDTO(
        String nome,
        String tipo,
        String descricao,
        String periculosidade,
        String unidadeMedida,
        Double quantidade
) {}
