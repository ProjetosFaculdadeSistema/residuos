package br.edu.ifpr.bsi.residuos.services;

import br.edu.ifpr.bsi.residuos.model.motorista.Motorista;
import br.edu.ifpr.bsi.residuos.repositories.MotoristaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class MotoristaService {

    @Autowired
    private MotoristaRepository motoristaRepository;

    @Transactional
    public Motorista salvar(Motorista motorista) {
        return this.motoristaRepository.save(motorista);
    }

    public List<Motorista> listar() {
        return this.motoristaRepository.findAll();
    }

    public List<Motorista> listarPorNome(String nome) {
        return this.motoristaRepository.buscarPorNomeLike(nome);
    }

    public Motorista obterPorId(Long codigo) {
        Motorista encontrado = this.motoristaRepository.findById(codigo).orElse(null);
        if (encontrado == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Motorista nao encontrado");
        }
        return encontrado;
    }

    @Transactional
    public Motorista atualizar(Long codigo, Motorista motorista) {
        this.motoristaRepository.findById(codigo).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Motorista nao encontrado"));
        motorista.setCodigo(codigo);
        return this.motoristaRepository.save(motorista);
    }

    @Transactional
    public void excluir(Long codigo) {
        this.motoristaRepository.findById(codigo).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Motorista nao encontrado"));
        this.motoristaRepository.deleteById(codigo);
    }
}
