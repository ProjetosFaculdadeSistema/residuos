package br.edu.ifpr.bsi.residuos.services;

import br.edu.ifpr.bsi.residuos.model.veiculo.Veiculo;
import br.edu.ifpr.bsi.residuos.repositories.VeiculoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class VeiculoService {

    @Autowired
    private VeiculoRepository veiculoRepository;

    @Transactional
    public Veiculo salvar(Veiculo veiculo) {
        return this.veiculoRepository.save(veiculo);
    }

    public List<Veiculo> listar() {
        return this.veiculoRepository.findAll();
    }

    public List<Veiculo> listarPorModelo(String modelo) {
        return this.veiculoRepository.buscarPorModeloLike(modelo);
    }

    public Veiculo obterPorId(Long codigo) {
        Veiculo encontrado = this.veiculoRepository.findById(codigo).orElse(null);
        if (encontrado == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Veiculo nao encontrado");
        }
        return encontrado;
    }

    @Transactional
    public Veiculo atualizar(Long codigo, Veiculo veiculo) {
        this.veiculoRepository.findById(codigo).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Veiculo nao encontrado"));
        veiculo.setCodigo(codigo);
        return this.veiculoRepository.save(veiculo);
    }

    @Transactional
    public void excluir(Long codigo) {
        this.veiculoRepository.findById(codigo).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Veiculo nao encontrado"));
        this.veiculoRepository.deleteById(codigo);
    }
}
