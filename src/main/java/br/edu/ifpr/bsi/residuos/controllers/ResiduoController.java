package br.edu.ifpr.bsi.residuos.controllers;

import br.edu.ifpr.bsi.residuos.dto.ResiduoRequestDTO;
import br.edu.ifpr.bsi.residuos.dto.ResiduoResponseDTO;
import br.edu.ifpr.bsi.residuos.mappers.ResiduoMapper;
import br.edu.ifpr.bsi.residuos.model.residuo.Residuo;
import br.edu.ifpr.bsi.residuos.services.ResiduoService;
import br.edu.ifpr.bsi.residuos.storage.StorageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/residuos")
public class ResiduoController {

    private final ResiduoService residuoService;
    private final StorageService storageService;
    private final ResiduoMapper residuoMapper;

    public ResiduoController(ResiduoService residuoService,
                             StorageService storageService,
                             ResiduoMapper residuoMapper) {
        this.residuoService = residuoService;
        this.storageService = storageService;
        this.residuoMapper = residuoMapper;
    }

    @GetMapping
    public ResponseEntity<List<ResiduoResponseDTO>> listar() {
        List<ResiduoResponseDTO> lista = residuoService.listar().stream()
                .map(residuoMapper::toDTO)
                .toList();
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/{codigo}")
    public ResponseEntity<ResiduoResponseDTO> buscar(@PathVariable Long codigo) {
        return ResponseEntity.ok(residuoMapper.toDTO(residuoService.obterPorId(codigo)));
    }

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<ResiduoResponseDTO> criar(
            @RequestPart("dados") ResiduoRequestDTO dto,
            @RequestPart(value = "imagem", required = false) MultipartFile imagem) throws Exception {
        Residuo residuo = residuoMapper.toEntity(dto);
        if (imagem != null && !imagem.isEmpty()) {
            String url = storageService.upload("residuos", imagem,
                    residuo.getNome().replaceAll("\\s+", "_"));
            residuo.setImagem(url);
        }
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(residuoMapper.toDTO(residuoService.salvar(residuo)));
    }

    @PutMapping(value = "/{codigo}", consumes = "multipart/form-data")
    public ResponseEntity<ResiduoResponseDTO> atualizar(
            @PathVariable Long codigo,
            @RequestPart("dados") ResiduoRequestDTO dto,
            @RequestPart(value = "imagem", required = false) MultipartFile imagem) throws Exception {
        Residuo residuo = residuoMapper.toEntity(dto);
        if (imagem != null && !imagem.isEmpty()) {
            String url = storageService.upload("residuos", imagem, codigo.toString());
            residuo.setImagem(url);
        }
        return ResponseEntity.ok(residuoMapper.toDTO(residuoService.atualizar(codigo, residuo)));
    }

    @DeleteMapping("/{codigo}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long codigo) {
        residuoService.excluir(codigo);
    }
}
