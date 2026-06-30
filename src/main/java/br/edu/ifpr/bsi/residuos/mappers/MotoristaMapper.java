package br.edu.ifpr.bsi.residuos.mappers;

import br.edu.ifpr.bsi.residuos.dto.MotoristaRequestDTO;
import br.edu.ifpr.bsi.residuos.dto.MotoristaResponseDTO;
import br.edu.ifpr.bsi.residuos.model.motorista.Motorista;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface MotoristaMapper {

    MotoristaResponseDTO toDTO(Motorista motorista);

    @Mapping(target = "coletas", ignore = true)
    Motorista toEntity(MotoristaRequestDTO dto);
}
