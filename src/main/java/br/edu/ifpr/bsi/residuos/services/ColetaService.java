package br.edu.ifpr.bsi.residuos.services;

import br.edu.ifpr.bsi.residuos.model.coleta.Coleta;
import br.edu.ifpr.bsi.residuos.repositories.ColetaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ColetaService {

    @Autowired
    private ColetaRepository coletaRepository;

    @Transactional
    public Coleta salvar(Coleta coleta) {
        return this.coletaRepository.save(coleta);
    }

    public List<Coleta> listar() {
        return this.coletaRepository.findAll();
    }

    public List<Coleta> listarPorStatus(String status) {
        return this.coletaRepository.buscarPorStatusLike(status);
    }

    public Coleta obterPorId(Long codigo) {
        Coleta encontrada = this.coletaRepository.findById(codigo).orElse(null);
        if (encontrada == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Coleta nao encontrada");
        }
        return encontrada;
    }

    @Transactional
    public Coleta atualizar(Long codigo, Coleta coleta) {
        this.coletaRepository.findById(codigo).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Coleta nao encontrada"));
        coleta.setCodigo(codigo);
        return this.coletaRepository.save(coleta);
    }

    @Transactional
    public void excluir(Long codigo) {
        this.coletaRepository.findById(codigo).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Coleta nao encontrada"));
        this.coletaRepository.deleteById(codigo);
    }
}
