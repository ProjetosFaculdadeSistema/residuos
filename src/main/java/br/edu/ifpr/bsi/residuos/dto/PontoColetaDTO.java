package br.edu.ifpr.bsi.residuos.dto;

public record PontoColetaDTO(
        Double latitude,
        Double longitude,
        Integer ordem,
        String nome
) {}
