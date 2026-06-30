package br.edu.ifpr.bsi.residuos.mappers;

import br.edu.ifpr.bsi.residuos.dto.VeiculoRequestDTO;
import br.edu.ifpr.bsi.residuos.dto.VeiculoResponseDTO;
import br.edu.ifpr.bsi.residuos.model.veiculo.Veiculo;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface VeiculoMapper {

    VeiculoResponseDTO toDTO(Veiculo veiculo);

    @Mapping(target = "coletas", ignore = true)
    Veiculo toEntity(VeiculoRequestDTO dto);
}
