package br.edu.ifpr.bsi.residuos.controllers;

import br.edu.ifpr.bsi.residuos.dto.RotaRequestDTO;
import br.edu.ifpr.bsi.residuos.dto.RotaResponseDTO;
import br.edu.ifpr.bsi.residuos.mappers.RotaMapper;
import br.edu.ifpr.bsi.residuos.services.RotaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rotas")
public class RotaController {

    private final RotaService rotaService;
    private final RotaMapper rotaMapper;

    public RotaController(RotaService rotaService, RotaMapper rotaMapper) {
        this.rotaService = rotaService;
        this.rotaMapper = rotaMapper;
    }

    @GetMapping
    public ResponseEntity<List<RotaResponseDTO>> listar() {
        List<RotaResponseDTO> lista = rotaService.listar().stream()
                .map(rotaMapper::toDTO)
                .toList();
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/{codigo}")
    public ResponseEntity<RotaResponseDTO> buscar(@PathVariable Long codigo) {
        return ResponseEntity.ok(rotaMapper.toDTO(rotaService.obterPorId(codigo)));
    }

    @PostMapping
    public ResponseEntity<RotaResponseDTO> criar(@RequestBody RotaRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(rotaMapper.toDTO(rotaService.salvar(rotaMapper.toEntity(dto))));
    }

    @PutMapping("/{codigo}")
    public ResponseEntity<RotaResponseDTO> atualizar(@PathVariable Long codigo,
                                                     @RequestBody RotaRequestDTO dto) {
        return ResponseEntity.ok(rotaMapper.toDTO(rotaService.atualizar(codigo, rotaMapper.toEntity(dto))));
    }

    @DeleteMapping("/{codigo}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long codigo) {
        rotaService.excluir(codigo);
    }
}
