package br.edu.ifpr.bsi.residuos.repositories;

import br.edu.ifpr.bsi.residuos.model.motorista.Motorista;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class MotoristaRepositoryTest {

    @Autowired
    private MotoristaRepository motoristaRepository;

    @Test
    void testInserir() {
        Motorista motorista = new Motorista();
        motorista.setNome("Joao Vitor Koch");
        motorista.setCnh("09646849938");
        motorista.setTelefone("46988255259");
        motorista.setStatus("Ativo");
        motorista.setCategoriaCnh("D");

        Motorista salvo = motoristaRepository.save(motorista);

        assertNotNull(salvo.getCodigo());
        assertEquals("Joao Vitor Koch", salvo.getNome());
    }

    @Test
    void testListar() {
        Motorista m1 = new Motorista();
        m1.setNome("Luiz Ricardo Zimmermann");
        m1.setCnh("11111111111");
        m1.setTelefone("46988256624");
        m1.setStatus("Ativo");
        m1.setCategoriaCnh("D");
        motoristaRepository.save(m1);

        Motorista m2 = new Motorista();
        m2.setNome("Eduardo Luiz Alba");
        m2.setCnh("22222222222");
        m2.setTelefone("44988880002");
        m2.setStatus("Ativo");
        m2.setCategoriaCnh("E");
        motoristaRepository.save(m2);

        List<Motorista> lista = motoristaRepository.findAll();
        assertFalse(lista.isEmpty());
    }

    @Test
    void testAtualizar() {
        Motorista motorista = new Motorista();
        motorista.setNome("Nathan Eduardo");
        motorista.setCnh("33333333333");
        motorista.setTelefone("46977770000");
        motorista.setStatus("Ativo");
        motorista.setCategoriaCnh("D");
        Motorista salvo = motoristaRepository.save(motorista);

        salvo.setStatus("Inativo");
        Motorista atualizado = motoristaRepository.save(salvo);

        assertEquals("Inativo", atualizado.getStatus());
    }

    @Test
    void testRemover() {
        Motorista motorista = new Motorista();
        motorista.setNome("Charles");
        motorista.setCnh("44444444444");
        motorista.setTelefone("46966660000");
        motorista.setStatus("Ativo");
        motorista.setCategoriaCnh("D");
        Motorista salvo = motoristaRepository.save(motorista);

        Long codigo = salvo.getCodigo();
        motoristaRepository.deleteById(codigo);

        Optional<Motorista> resultado = motoristaRepository.findById(codigo);
        assertFalse(resultado.isPresent());
    }

    @Test
    void testBuscarPorNome() {
        Motorista motorista = new Motorista();
        motorista.setNome("William");
        motorista.setCnh("55555555555");
        motorista.setTelefone("46955550000");
        motorista.setStatus("Ativo");
        motorista.setCategoriaCnh("E");
        motoristaRepository.save(motorista);

        List<Motorista> resultado = motoristaRepository.findByNome("William");
        assertFalse(resultado.isEmpty());
    }

    @Test
    void testBuscarPorNomeLike() {
        Motorista motorista = new Motorista();
        motorista.setNome("Kayllane");
        motorista.setCnh("66666666666");
        motorista.setTelefone("46944440000");
        motorista.setStatus("Ativo");
        motorista.setCategoriaCnh("D");
        motoristaRepository.save(motorista);

        List<Motorista> resultado = motoristaRepository.buscarPorNomeLike("Kayllane");
        assertFalse(resultado.isEmpty());
    }

    @Test
    void testQueryNativa() {
        Motorista motorista = new Motorista();
        motorista.setNome("Joao Vitor Koch");
        motorista.setCnh("77777777777");
        motorista.setTelefone("46933330000");
        motorista.setStatus("Ativo");
        motorista.setCategoriaCnh("D");
        motoristaRepository.save(motorista);

        List<Motorista> resultado = motoristaRepository.buscarPorStatusLimitado("Ativo", 5);
        assertFalse(resultado.isEmpty());
    }
}
