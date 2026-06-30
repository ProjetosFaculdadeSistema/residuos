package br.edu.ifpr.bsi.residuos.dto;

import br.edu.ifpr.bsi.residuos.model.coleta.Coleta;

import java.time.LocalDateTime;

public record ColetaResponseDTO(
        Long codigo,
        LocalDateTime dataColeta,
        String observacao,
        Long residuoId,
        String residuoNome,
        Long motoristaId,
        String motoristaNome,
        Long veiculoId,
        String veiculoPlaca,
        Long rotaId,
        String rotaNome
) {
    public static ColetaResponseDTO fromEntity(Coleta c) {
        return new ColetaResponseDTO(
            c.getCodigo(),
            c.getDataColeta(),
            c.getObservacao(),
            c.getResiduo() != null ? c.getResiduo().getCodigo() : null,
            c.getResiduo() != null ? c.getResiduo().getNome() : null,
            c.getMotorista() != null ? c.getMotorista().getCodigo() : null,
            c.getMotorista() != null ? c.getMotorista().getNome() : null,
            c.getVeiculo() != null ? c.getVeiculo().getCodigo() : null,
            c.getVeiculo() != null ? c.getVeiculo().getPlaca() : null,
            c.getRota() != null ? c.getRota().getCodigo() : null,
            c.getRota() != null ? c.getRota().getNome() : null
        );
    }
}
