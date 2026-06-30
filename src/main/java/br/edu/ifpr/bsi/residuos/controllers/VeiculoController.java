package br.edu.ifpr.bsi.residuos.controllers;

import br.edu.ifpr.bsi.residuos.dto.VeiculoRequestDTO;
import br.edu.ifpr.bsi.residuos.dto.VeiculoResponseDTO;
import br.edu.ifpr.bsi.residuos.mappers.VeiculoMapper;
import br.edu.ifpr.bsi.residuos.model.veiculo.Veiculo;
import br.edu.ifpr.bsi.residuos.services.VeiculoService;
import br.edu.ifpr.bsi.residuos.storage.StorageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/veiculos")
public class VeiculoController {

    private final VeiculoService veiculoService;
    private final VeiculoMapper veiculoMapper;
    private final StorageService storageService;

    public VeiculoController(VeiculoService veiculoService,
                             VeiculoMapper veiculoMapper,
                             StorageService storageService) {
        this.veiculoService = veiculoService;
        this.veiculoMapper = veiculoMapper;
        this.storageService = storageService;
    }

    @GetMapping
    public ResponseEntity<List<VeiculoResponseDTO>> listar() {
        List<VeiculoResponseDTO> lista = veiculoService.listar().stream()
                .map(veiculoMapper::toDTO)
                .toList();
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/{codigo}")
    public ResponseEntity<VeiculoResponseDTO> buscar(@PathVariable Long codigo) {
        return ResponseEntity.ok(veiculoMapper.toDTO(veiculoService.obterPorId(codigo)));
    }

    @PostMapping(consumes = {"multipart/form-data", "application/json"})
    public ResponseEntity<VeiculoResponseDTO> criar(
            @RequestPart("dados") VeiculoRequestDTO dto,
            @RequestPart(value = "foto", required = false) MultipartFile foto) throws Exception {
        Veiculo veiculo = veiculoMapper.toEntity(dto);
        if (foto != null && !foto.isEmpty()) {
            String url = storageService.upload("veiculos", foto,
                    veiculo.getPlaca().replaceAll("[^a-zA-Z0-9]", "_"));
            veiculo.setFoto(url);
        }
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(veiculoMapper.toDTO(veiculoService.salvar(veiculo)));
    }

    @PutMapping(value = "/{codigo}", consumes = {"multipart/form-data", "application/json"})
    public ResponseEntity<VeiculoResponseDTO> atualizar(
            @PathVariable Long codigo,
            @RequestPart("dados") VeiculoRequestDTO dto,
            @RequestPart(value = "foto", required = false) MultipartFile foto) throws Exception {
        Veiculo veiculo = veiculoMapper.toEntity(dto);
        if (foto != null && !foto.isEmpty()) {
            String url = storageService.upload("veiculos", foto, codigo.toString());
            veiculo.setFoto(url);
        } else {
            // Sem nova foto: preserva a que já estava salva
            Veiculo existente = veiculoService.obterPorId(codigo);
            veiculo.setFoto(existente.getFoto());
        }
        return ResponseEntity.ok(
                veiculoMapper.toDTO(veiculoService.atualizar(codigo, veiculo)));
    }

    @DeleteMapping("/{codigo}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long codigo) {
        veiculoService.excluir(codigo);
    }
}
