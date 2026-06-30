package br.edu.ifpr.bsi.residuos.repositories;

import br.edu.ifpr.bsi.residuos.model.veiculo.Veiculo;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class VeiculoRepositoryTest {

    @Autowired
    private VeiculoRepository veiculoRepository;

    @Test
    void testInserir() {
        Veiculo veiculo = new Veiculo();
        veiculo.setPlaca("ABC1234");
        veiculo.setModelo("Mercedes Atego");
        veiculo.setCapacidade(8000.0);
        veiculo.setTipo("Caminhao Compactador");
        veiculo.setAno(2020);

        Veiculo salvo = veiculoRepository.save(veiculo);

        assertNotNull(salvo.getCodigo());
        assertEquals("ABC1234", salvo.getPlaca());
    }

    @Test
    void testListar() {
        Veiculo v1 = new Veiculo();
        v1.setPlaca("DEF5678");
        v1.setModelo("Volkswagen Delivery");
        v1.setCapacidade(5000.0);
        v1.setTipo("Caminhao Basculante");
        v1.setAno(2019);
        veiculoRepository.save(v1);

        Veiculo v2 = new Veiculo();
        v2.setPlaca("GHI9012");
        v2.setModelo("Ford Cargo");
        v2.setCapacidade(6000.0);
        v2.setTipo("Caminhao Compactador");
        v2.setAno(2021);
        veiculoRepository.save(v2);

        List<Veiculo> lista = veiculoRepository.findAll();
        assertFalse(lista.isEmpty());
    }

    @Test
    void testAtualizar() {
        Veiculo veiculo = new Veiculo();
        veiculo.setPlaca("JKL3456");
        veiculo.setModelo("Iveco Tector");
        veiculo.setCapacidade(7000.0);
        veiculo.setTipo("Caminhao Compactador");
        veiculo.setAno(2018);
        Veiculo salvo = veiculoRepository.save(veiculo);

        salvo.setCapacidade(7500.0);
        Veiculo atualizado = veiculoRepository.save(salvo);

        assertEquals(7500.0, atualizado.getCapacidade());
    }

    @Test
    void testRemover() {
        Veiculo veiculo = new Veiculo();
        veiculo.setPlaca("MNO7890");
        veiculo.setModelo("Scania P360");
        veiculo.setCapacidade(10000.0);
        veiculo.setTipo("Caminhao Basculante");
        veiculo.setAno(2022);
        Veiculo salvo = veiculoRepository.save(veiculo);

        Long codigo = salvo.getCodigo();
        veiculoRepository.deleteById(codigo);

        Optional<Veiculo> resultado = veiculoRepository.findById(codigo);
        assertFalse(resultado.isPresent());
    }

    @Test
    void testBuscarPorPlaca() {
        Veiculo veiculo = new Veiculo();
        veiculo.setPlaca("PQR1111");
        veiculo.setModelo("DAF CF");
        veiculo.setCapacidade(9000.0);
        veiculo.setTipo("Caminhao Compactador");
        veiculo.setAno(2023);
        veiculoRepository.save(veiculo);

        List<Veiculo> resultado = veiculoRepository.findByPlaca("PQR1111");
        assertFalse(resultado.isEmpty());
    }

    @Test
    void testBuscarPorModeloLike() {
        Veiculo veiculo = new Veiculo();
        veiculo.setPlaca("STU2222");
        veiculo.setModelo("Mercedes Actros");
        veiculo.setCapacidade(12000.0);
        veiculo.setTipo("Caminhao Basculante");
        veiculo.setAno(2021);
        veiculoRepository.save(veiculo);

        List<Veiculo> resultado = veiculoRepository.buscarPorModeloLike("Mercedes");
        assertFalse(resultado.isEmpty());
    }

    @Test
    void testQueryNativa() {
        Veiculo veiculo = new Veiculo();
        veiculo.setPlaca("VWX3333");
        veiculo.setModelo("Volvo FH");
        veiculo.setCapacidade(15000.0);
        veiculo.setTipo("Caminhao Basculante");
        veiculo.setAno(2022);
        veiculoRepository.save(veiculo);

        List<Veiculo> resultado = veiculoRepository.buscarPorTipoLimitado("Caminhao Basculante", 5);
        assertFalse(resultado.isEmpty());
    }
}
