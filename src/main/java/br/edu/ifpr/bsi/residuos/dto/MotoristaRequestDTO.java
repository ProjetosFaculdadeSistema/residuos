package br.edu.ifpr.bsi.residuos.dto;

public record MotoristaRequestDTO(
        String nome,
        String cnh,
        String telefone,
        String status,
        String categoriaCnh
) {}
