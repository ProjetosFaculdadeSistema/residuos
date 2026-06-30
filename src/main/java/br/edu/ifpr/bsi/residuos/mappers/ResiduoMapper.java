package br.edu.ifpr.bsi.residuos.mappers;

import br.edu.ifpr.bsi.residuos.dto.ResiduoRequestDTO;
import br.edu.ifpr.bsi.residuos.dto.ResiduoResponseDTO;
import br.edu.ifpr.bsi.residuos.model.residuo.Residuo;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ResiduoMapper {

    ResiduoResponseDTO toDTO(Residuo residuo);

    @Mapping(target = "imagem", ignore = true)
    @Mapping(target = "coletas", ignore = true)
    Residuo toEntity(ResiduoRequestDTO dto);
}
