package br.edu.ifpr.bsi.residuos.dto;

public record MotoristaResponseDTO(
        Long codigo,
        String nome,
        String cnh,
        String telefone,
        String status,
        String categoriaCnh,
        String foto
) {}
