package br.edu.ifpr.bsi.residuos.dto;

import java.util.List;

public record RotaRequestDTO(
        String nome,
        String bairro,
        String cidade,
        Double distanciaKm,
        String diaSemana,
        List<PontoColetaDTO> pontos
) {}
