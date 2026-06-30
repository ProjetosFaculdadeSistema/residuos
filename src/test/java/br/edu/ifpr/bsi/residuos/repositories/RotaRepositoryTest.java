package br.edu.ifpr.bsi.residuos.repositories;

import br.edu.ifpr.bsi.residuos.model.rota.Rota;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class RotaRepositoryTest {

    @Autowired
    private RotaRepository rotaRepository;

    @Test
    void testInserir() {
        Rota rota = new Rota();
        rota.setNome("Rota Centro");
        rota.setBairro("Centro");
        rota.setCidade("Palmas");
        rota.setDistanciaKm(12.5);
        rota.setDiaSemana("Segunda");

        Rota salva = rotaRepository.save(rota);

        assertNotNull(salva.getCodigo());
        assertEquals("Rota Centro", salva.getNome());
    }

    @Test
    void testListar() {
        Rota r1 = new Rota();
        r1.setNome("Rota Norte");
        r1.setBairro("Zona Norte");
        r1.setCidade("Palmas");
        r1.setDistanciaKm(18.0);
        r1.setDiaSemana("Terca");
        rotaRepository.save(r1);

        Rota r2 = new Rota();
        r2.setNome("Rota Sul");
        r2.setBairro("Zona Sul");
        r2.setCidade("Palmas");
        r2.setDistanciaKm(15.0);
        r2.setDiaSemana("Quarta");
        rotaRepository.save(r2);

        List<Rota> lista = rotaRepository.findAll();
        assertFalse(lista.isEmpty());
    }

    @Test
    void testAtualizar() {
        Rota rota = new Rota();
        rota.setNome("Rota Leste");
        rota.setBairro("Zona Leste");
        rota.setCidade("Palmas");
        rota.setDistanciaKm(20.0);
        rota.setDiaSemana("Quinta");
        Rota salva = rotaRepository.save(rota);

        salva.setDistanciaKm(22.5);
        Rota atualizada = rotaRepository.save(salva);

        assertEquals(22.5, atualizada.getDistanciaKm());
    }

    @Test
    void testRemover() {
        Rota rota = new Rota();
        rota.setNome("Rota Oeste");
        rota.setBairro("Zona Oeste");
        rota.setCidade("Palmas");
        rota.setDistanciaKm(10.0);
        rota.setDiaSemana("Sexta");
        Rota salva = rotaRepository.save(rota);

        Long codigo = salva.getCodigo();
        rotaRepository.deleteById(codigo);

        Optional<Rota> resultado = rotaRepository.findById(codigo);
        assertFalse(resultado.isPresent());
    }

    @Test
    void testBuscarPorNome() {
        Rota rota = new Rota();
        rota.setNome("Rota Industrial");
        rota.setBairro("Distrito Industrial");
        rota.setCidade("Palmas");
        rota.setDistanciaKm(25.0);
        rota.setDiaSemana("Sabado");
        rotaRepository.save(rota);

        List<Rota> resultado = rotaRepository.findByNome("Rota Industrial");
        assertFalse(resultado.isEmpty());
    }

    @Test
    void testBuscarPorCidadeLike() {
        Rota rota = new Rota();
        rota.setNome("Rota Comercial");
        rota.setBairro("Centro Comercial");
        rota.setCidade("Palmas do Parana");
        rota.setDistanciaKm(8.0);
        rota.setDiaSemana("Segunda");
        rotaRepository.save(rota);

        List<Rota> resultado = rotaRepository.buscarPorCidadeLike("Palmas");
        assertFalse(resultado.isEmpty());
    }

    @Test
    void testQueryNativa() {
        Rota rota = new Rota();
        rota.setNome("Rota Residencial");
        rota.setBairro("Jardim das Flores");
        rota.setCidade("Palmas");
        rota.setDistanciaKm(14.0);
        rota.setDiaSemana("Terca");
        rotaRepository.save(rota);

        List<Rota> resultado = rotaRepository.buscarPorDiaSemanaLimitado("Terca", 5);
        assertFalse(resultado.isEmpty());
    }
}
