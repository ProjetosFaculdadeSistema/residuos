package br.edu.ifpr.bsi.residuos.controllers;

import br.edu.ifpr.bsi.residuos.dto.ColetaRequestDTO;
import br.edu.ifpr.bsi.residuos.dto.ColetaResponseDTO;
import br.edu.ifpr.bsi.residuos.model.coleta.Coleta;
import br.edu.ifpr.bsi.residuos.model.motorista.Motorista;
import br.edu.ifpr.bsi.residuos.model.residuo.Residuo;
import br.edu.ifpr.bsi.residuos.model.rota.Rota;
import br.edu.ifpr.bsi.residuos.model.veiculo.Veiculo;
import br.edu.ifpr.bsi.residuos.repositories.MotoristaRepository;
import br.edu.ifpr.bsi.residuos.repositories.ResiduoRepository;
import br.edu.ifpr.bsi.residuos.repositories.RotaRepository;
import br.edu.ifpr.bsi.residuos.repositories.VeiculoRepository;
import br.edu.ifpr.bsi.residuos.services.ColetaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/coletas")
public class ColetaController {

    @Autowired
    private ColetaService coletaService;

    @Autowired
    private ResiduoRepository residuoRepository;

    @Autowired
    private MotoristaRepository motoristaRepository;

    @Autowired
    private VeiculoRepository veiculoRepository;

    @Autowired
    private RotaRepository rotaRepository;

    @GetMapping
    public ResponseEntity<List<ColetaResponseDTO>> listar() {
        List<ColetaResponseDTO> lista = coletaService.listar().stream()
                .map(ColetaResponseDTO::fromEntity).toList();
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/{codigo}")
    public ResponseEntity<ColetaResponseDTO> buscar(@PathVariable Long codigo) {
        return ResponseEntity.ok(ColetaResponseDTO.fromEntity(coletaService.obterPorId(codigo)));
    }

    @PostMapping
    public ResponseEntity<ColetaResponseDTO> criar(@RequestBody ColetaRequestDTO dto) {
        Coleta coleta = montarColeta(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ColetaResponseDTO.fromEntity(coletaService.salvar(coleta)));
    }

    @PutMapping("/{codigo}")
    public ResponseEntity<ColetaResponseDTO> atualizar(@PathVariable Long codigo, @RequestBody ColetaRequestDTO dto) {
        Coleta coleta = montarColeta(dto);
        return ResponseEntity.ok(ColetaResponseDTO.fromEntity(coletaService.atualizar(codigo, coleta)));
    }

    @DeleteMapping("/{codigo}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long codigo) {
        coletaService.excluir(codigo);
    }

    private Coleta montarColeta(ColetaRequestDTO dto) {
        Coleta coleta = new Coleta();
        if (dto.dataColeta() != null) {
            coleta.setDataColeta(dto.dataColeta().atStartOfDay());
        }
        coleta.setObservacao(dto.observacao());

        if (dto.residuoId() != null) {
            Residuo residuo = residuoRepository.findById(dto.residuoId()).orElse(null);
            coleta.setResiduo(residuo);
        }
        if (dto.motoristaId() != null) {
            Motorista motorista = motoristaRepository.findById(dto.motoristaId()).orElse(null);
            coleta.setMotorista(motorista);
        }
        if (dto.veiculoId() != null) {
            Veiculo veiculo = veiculoRepository.findById(dto.veiculoId()).orElse(null);
            coleta.setVeiculo(veiculo);
        }
        if (dto.rotaId() != null) {
            Rota rota = rotaRepository.findById(dto.rotaId()).orElse(null);
            coleta.setRota(rota);
        }
        return coleta;
    }
}
