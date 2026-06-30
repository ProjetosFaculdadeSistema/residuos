package br.edu.ifpr.bsi.residuos.mappers;

import br.edu.ifpr.bsi.residuos.dto.PontoColetaDTO;
import br.edu.ifpr.bsi.residuos.dto.RotaRequestDTO;
import br.edu.ifpr.bsi.residuos.dto.RotaResponseDTO;
import br.edu.ifpr.bsi.residuos.model.rota.PontoColeta;
import br.edu.ifpr.bsi.residuos.model.rota.Rota;
import org.mapstruct.*;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface RotaMapper {

    RotaResponseDTO toDTO(Rota rota);

    PontoColetaDTO pontoToDTO(PontoColeta ponto);

    @Mapping(target = "coletas", ignore = true)
    Rota toEntity(RotaRequestDTO dto);

    @Mapping(target = "rota", ignore = true)
    PontoColeta pontoToEntity(PontoColetaDTO dto);

    // Após mapear RotaRequestDTO → Rota, vincula cada PontoColeta à sua rota pai
    @AfterMapping
    default void setRotaEmPontos(@MappingTarget Rota rota) {
        if (rota.getPontos() != null) {
            rota.getPontos().forEach(p -> p.setRota(rota));
        }
    }
}
