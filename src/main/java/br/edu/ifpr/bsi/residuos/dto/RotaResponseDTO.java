package br.edu.ifpr.bsi.residuos.dto;

import java.util.List;

public record RotaResponseDTO(
        Long codigo,
        String nome,
        String bairro,
        String cidade,
        Double distanciaKm,
        String diaSemana,
        List<PontoColetaDTO> pontos
) {}
