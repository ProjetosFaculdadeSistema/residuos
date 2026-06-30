package br.edu.ifpr.bsi.residuos.services;

import br.edu.ifpr.bsi.residuos.model.rota.Rota;
import br.edu.ifpr.bsi.residuos.repositories.RotaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class RotaService {

    private final RotaRepository rotaRepository;

    public RotaService(RotaRepository rotaRepository) {
        this.rotaRepository = rotaRepository;
    }

    @Transactional
    public Rota salvar(Rota rota) {
        return this.rotaRepository.save(rota);
    }

    public List<Rota> listar() {
        return this.rotaRepository.findAll();
    }

    public List<Rota> listarPorCidade(String cidade) {
        return this.rotaRepository.buscarPorCidadeLike(cidade);
    }

    public Rota obterPorId(Long codigo) {
        return this.rotaRepository.findById(codigo)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Rota nao encontrada"));
    }

    @Transactional
    public Rota atualizar(Long codigo, Rota rotaAtualizada) {
        Rota existente = this.rotaRepository.findById(codigo)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Rota nao encontrada"));

        existente.setNome(rotaAtualizada.getNome());
        existente.setBairro(rotaAtualizada.getBairro());
        existente.setCidade(rotaAtualizada.getCidade());
        existente.setDistanciaKm(rotaAtualizada.getDistanciaKm());
        existente.setDiaSemana(rotaAtualizada.getDiaSemana());

        // Substitui a lista de pontos (orphanRemoval cuida de deletar os antigos)
        existente.getPontos().clear();
        if (rotaAtualizada.getPontos() != null) {
            rotaAtualizada.getPontos().forEach(p -> {
                p.setRota(existente);
                existente.getPontos().add(p);
            });
        }

        return this.rotaRepository.save(existente);
    }

    @Transactional
    public void excluir(Long codigo) {
        this.rotaRepository.findById(codigo)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Rota nao encontrada"));
        this.rotaRepository.deleteById(codigo);
    }
}
