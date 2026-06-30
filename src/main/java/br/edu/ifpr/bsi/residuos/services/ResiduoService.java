package br.edu.ifpr.bsi.residuos.services;

import br.edu.ifpr.bsi.residuos.model.residuo.Residuo;
import br.edu.ifpr.bsi.residuos.repositories.ResiduoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ResiduoService {

    @Autowired
    private ResiduoRepository residuoRepository;

    @Transactional
    public Residuo salvar(Residuo residuo) {
        return this.residuoRepository.save(residuo);
    }

    public List<Residuo> listar() {
        return this.residuoRepository.findAll();
    }

    public List<Residuo> listarPorNome(String nome) {
        return this.residuoRepository.buscarPorNomeLike(nome);
    }

    public Residuo obterPorId(Long codigo) {
        Residuo encontrado = this.residuoRepository.findById(codigo).orElse(null);
        if (encontrado == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Residuo nao encontrado");
        }
        return encontrado;
    }

    @Transactional
    public Residuo atualizar(Long codigo, Residuo residuo) {
        this.residuoRepository.findById(codigo).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Residuo nao encontrado"));
        residuo.setCodigo(codigo);
        return this.residuoRepository.save(residuo);
    }

    @Transactional
    public void excluir(Long codigo) {
        this.residuoRepository.findById(codigo).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Residuo nao encontrado"));
        this.residuoRepository.deleteById(codigo);
    }
}
