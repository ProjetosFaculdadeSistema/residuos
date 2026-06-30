package br.edu.ifpr.bsi.residuos.controllers;

import br.edu.ifpr.bsi.residuos.dto.*;
import br.edu.ifpr.bsi.residuos.model.usuario.Usuario;
import br.edu.ifpr.bsi.residuos.repositories.UsuarioRepository;
import br.edu.ifpr.bsi.residuos.security.JwtService;
import br.edu.ifpr.bsi.residuos.storage.StorageService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final StorageService storageService;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtService jwtService,
                          UsuarioRepository usuarioRepository,
                          PasswordEncoder passwordEncoder,
                          StorageService storageService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.storageService = storageService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO dto) {
        // o AuthenticationManager valida email/senha e lança exceção se estiver errado
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.email(), dto.senha())
        );
        // getPrincipal() retorna o UserDetails — que no nosso caso é o próprio Usuario
        Usuario usuario = (Usuario) auth.getPrincipal();
        String token = jwtService.gerarToken(usuario.getEmail());
        UsuarioResponseDTO usuarioDTO = new UsuarioResponseDTO(
                usuario.getId(), usuario.getNome(), usuario.getEmail(), usuario.getFoto());
        return ResponseEntity.ok(new LoginResponseDTO(token, usuarioDTO));
    }

    // multipart/form-data porque precisamos receber JSON e arquivo (foto) na mesma requisição
    @PostMapping(value = "/registrar", consumes = "multipart/form-data")
    public ResponseEntity<UsuarioResponseDTO> registrar(
            @RequestPart("dados") RegistroRequestDTO dto,
            @RequestPart(value = "foto", required = false) MultipartFile foto) throws Exception {

        if (usuarioRepository.findByEmail(dto.email()).isPresent()) {
            return ResponseEntity.badRequest().build();
        }

        String fotoUrl = null;
        if (foto != null && !foto.isEmpty()) {
            // o email vira o public_id no Cloudinary — trocamos @ para evitar problemas na URL
            fotoUrl = storageService.upload("usuarios", foto, dto.email().replace("@", "_"));
        }

        Usuario usuario = new Usuario(dto.nome(), dto.email(), passwordEncoder.encode(dto.senha()), fotoUrl);
        usuarioRepository.save(usuario);

        return ResponseEntity.ok(new UsuarioResponseDTO(
                usuario.getId(), usuario.getNome(), usuario.getEmail(), usuario.getFoto()));
    }
}
