package br.edu.ifpr.bsi.residuos.repositories;

import br.edu.ifpr.bsi.residuos.model.residuo.Residuo;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class ResiduoRepositoryTest {

    @Autowired
    private ResiduoRepository residuoRepository;

    @Test
    void testInserir() {
        Residuo residuo = new Residuo();
        residuo.setNome("Papel");
        residuo.setTipo("Reciclavel");
        residuo.setDescricao("Papel e papelao");
        residuo.setPericulosidade("Baixa");
        residuo.setUnidadeMedida("kg");

        Residuo salvo = residuoRepository.save(residuo);

        assertNotNull(salvo.getCodigo());
        assertEquals("Papel", salvo.getNome());
    }

    @Test
    void testListar() {
        Residuo r1 = new Residuo();
        r1.setNome("Plastico");
        r1.setTipo("Reciclavel");
        r1.setDescricao("Plastico em geral");
        r1.setPericulosidade("Media");
        r1.setUnidadeMedida("kg");
        residuoRepository.save(r1);

        Residuo r2 = new Residuo();
        r2.setNome("Vidro");
        r2.setTipo("Reciclavel");
        r2.setDescricao("Vidro em geral");
        r2.setPericulosidade("Media");
        r2.setUnidadeMedida("kg");
        residuoRepository.save(r2);

        List<Residuo> lista = residuoRepository.findAll();
        assertFalse(lista.isEmpty());
    }

    @Test
    void testAtualizar() {
        Residuo residuo = new Residuo();
        residuo.setNome("Metal");
        residuo.setTipo("Reciclavel");
        residuo.setDescricao("Metais em geral");
        residuo.setPericulosidade("Baixa");
        residuo.setUnidadeMedida("kg");
        Residuo salvo = residuoRepository.save(residuo);

        salvo.setNome("Metal Ferroso");
        Residuo atualizado = residuoRepository.save(salvo);

        assertEquals("Metal Ferroso", atualizado.getNome());
    }

    @Test
    void testRemover() {
        Residuo residuo = new Residuo();
        residuo.setNome("Organico");
        residuo.setTipo("Nao reciclavel");
        residuo.setDescricao("Residuo organico");
        residuo.setPericulosidade("Baixa");
        residuo.setUnidadeMedida("kg");
        Residuo salvo = residuoRepository.save(residuo);

        Long codigo = salvo.getCodigo();
        residuoRepository.deleteById(codigo);

        Optional<Residuo> resultado = residuoRepository.findById(codigo);
        assertFalse(resultado.isPresent());
    }

    @Test
    void testBuscarPorNome() {
        Residuo residuo = new Residuo();
        residuo.setNome("Eletronico");
        residuo.setTipo("Especial");
        residuo.setDescricao("Equipamentos eletronicos");
        residuo.setPericulosidade("Alta");
        residuo.setUnidadeMedida("un");
        residuoRepository.save(residuo);

        List<Residuo> resultado = residuoRepository.findByNome("Eletronico");
        assertFalse(resultado.isEmpty());
        assertEquals("Eletronico", resultado.get(0).getNome());
    }

    @Test
    void testBuscarPorNomeLike() {
        Residuo residuo = new Residuo();
        residuo.setNome("Quimico Hospitalar");
        residuo.setTipo("Perigoso");
        residuo.setDescricao("Residuos de hospitais");
        residuo.setPericulosidade("Alta");
        residuo.setUnidadeMedida("kg");
        residuoRepository.save(residuo);

        List<Residuo> resultado = residuoRepository.buscarPorNomeLike("Quimico");
        assertFalse(resultado.isEmpty());
    }

    @Test
    void testQueryNativa() {
        Residuo residuo = new Residuo();
        residuo.setNome("Bateria");
        residuo.setTipo("Especial");
        residuo.setDescricao("Baterias e pilhas");
        residuo.setPericulosidade("Alta");
        residuo.setUnidadeMedida("un");
        residuoRepository.save(residuo);

        List<Residuo> resultado = residuoRepository.buscarPorTipoLimitado("Especial", 5);
        assertFalse(resultado.isEmpty());
    }
}
