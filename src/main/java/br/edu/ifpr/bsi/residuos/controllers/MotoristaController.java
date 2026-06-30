package br.edu.ifpr.bsi.residuos.controllers;

import br.edu.ifpr.bsi.residuos.dto.MotoristaRequestDTO;
import br.edu.ifpr.bsi.residuos.dto.MotoristaResponseDTO;
import br.edu.ifpr.bsi.residuos.mappers.MotoristaMapper;
import br.edu.ifpr.bsi.residuos.model.motorista.Motorista;
import br.edu.ifpr.bsi.residuos.services.MotoristaService;
import br.edu.ifpr.bsi.residuos.storage.StorageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/motoristas")
public class MotoristaController {

    private final MotoristaService motoristaService;
    private final MotoristaMapper motoristaMapper;
    private final StorageService storageService;

    public MotoristaController(MotoristaService motoristaService,
                               MotoristaMapper motoristaMapper,
                               StorageService storageService) {
        this.motoristaService = motoristaService;
        this.motoristaMapper = motoristaMapper;
        this.storageService = storageService;
    }

    @GetMapping
    public ResponseEntity<List<MotoristaResponseDTO>> listar() {
        List<MotoristaResponseDTO> lista = motoristaService.listar().stream()
                .map(motoristaMapper::toDTO)
                .toList();
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/{codigo}")
    public ResponseEntity<MotoristaResponseDTO> buscar(@PathVariable Long codigo) {
        return ResponseEntity.ok(motoristaMapper.toDTO(motoristaService.obterPorId(codigo)));
    }

    @PostMapping(consumes = {"multipart/form-data", "application/json"})
    public ResponseEntity<MotoristaResponseDTO> criar(
            @RequestPart("dados") MotoristaRequestDTO dto,
            @RequestPart(value = "foto", required = false) MultipartFile foto) throws Exception {
        Motorista motorista = motoristaMapper.toEntity(dto);
        if (foto != null && !foto.isEmpty()) {
            // Usa o nome do motorista como public_id no Cloudinary
            String url = storageService.upload("motoristas", foto,
                    motorista.getNome().replaceAll("\\s+", "_"));
            motorista.setFoto(url);
        }
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(motoristaMapper.toDTO(motoristaService.salvar(motorista)));
    }

    @PutMapping(value = "/{codigo}", consumes = {"multipart/form-data", "application/json"})
    public ResponseEntity<MotoristaResponseDTO> atualizar(
            @PathVariable Long codigo,
            @RequestPart("dados") MotoristaRequestDTO dto,
            @RequestPart(value = "foto", required = false) MultipartFile foto) throws Exception {
        Motorista motorista = motoristaMapper.toEntity(dto);
        if (foto != null && !foto.isEmpty()) {
            String url = storageService.upload("motoristas", foto, codigo.toString());
            motorista.setFoto(url);
        } else {
            // Sem nova foto: preserva a que já estava salva
            Motorista existente = motoristaService.obterPorId(codigo);
            motorista.setFoto(existente.getFoto());
        }
        return ResponseEntity.ok(
                motoristaMapper.toDTO(motoristaService.atualizar(codigo, motorista)));
    }

    @DeleteMapping("/{codigo}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long codigo) {
        motoristaService.excluir(codigo);
    }
}
