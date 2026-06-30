package br.edu.ifpr.bsi.residuos.dto;

import java.time.LocalDate;

public record ColetaRequestDTO(
        LocalDate dataColeta,
        Long residuoId,
        Long motoristaId,
        Long veiculoId,
        Long rotaId,
        String observacao
) {}
