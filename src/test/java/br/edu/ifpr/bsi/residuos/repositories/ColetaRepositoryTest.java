package br.edu.ifpr.bsi.residuos.repositories;

import br.edu.ifpr.bsi.residuos.model.coleta.Coleta;
import br.edu.ifpr.bsi.residuos.model.motorista.Motorista;
import br.edu.ifpr.bsi.residuos.model.residuo.Residuo;
import br.edu.ifpr.bsi.residuos.model.rota.Rota;
import br.edu.ifpr.bsi.residuos.model.veiculo.Veiculo;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class ColetaRepositoryTest {

    @Autowired
    private ColetaRepository coletaRepository;

    @Autowired
    private ResiduoRepository residuoRepository;

    @Autowired
    private MotoristaRepository motoristaRepository;

    @Autowired
    private VeiculoRepository veiculoRepository;

    @Autowired
    private RotaRepository rotaRepository;

    private Residuo criarResiduo() {
        Residuo residuo = new Residuo();
        residuo.setNome("Papel");
        residuo.setTipo("Reciclavel");
        residuo.setDescricao("Papel e papelao");
        residuo.setPericulosidade("Baixa");
        residuo.setUnidadeMedida("kg");
        return residuoRepository.save(residuo);
    }

    private Motorista criarMotorista() {
        Motorista motorista = new Motorista();
        motorista.setNome("Joao Vitor Koch");
        motorista.setCnh("09646849938");
        motorista.setTelefone("46988255259");
        motorista.setStatus("Ativo");
        motorista.setCategoriaCnh("D");
        return motoristaRepository.save(motorista);
    }

    private Veiculo criarVeiculo() {
        Veiculo veiculo = new Veiculo();
        veiculo.setPlaca("ABC1234");
        veiculo.setModelo("Mercedes Atego");
        veiculo.setCapacidade(8000.0);
        veiculo.setTipo("Caminhao Compactador");
        veiculo.setAno(2020);
        return veiculoRepository.save(veiculo);
    }

    private Rota criarRota() {
        Rota rota = new Rota();
        rota.setNome("Rota Centro");
        rota.setBairro("Centro");
        rota.setCidade("Palmas");
        rota.setDistanciaKm(10.0);
        rota.setDiaSemana("Segunda");
        return rotaRepository.save(rota);
    }

    @Test
    void testInserirComRelacionamentos() {
        Residuo residuo = criarResiduo();
        Motorista motorista = criarMotorista();
        Veiculo veiculo = criarVeiculo();
        Rota rota = criarRota();

        Coleta coleta = new Coleta();
        coleta.setDataColeta(LocalDateTime.now());
        coleta.setQuantidadeColetada(350.0);
        coleta.setStatus("Concluida");
        coleta.setObservacao("Coleta realizada sem intercorrencias");
        coleta.setDestino("Aterro Sanitario Municipal");
        coleta.setResiduo(residuo);
        coleta.setMotorista(motorista);
        coleta.setVeiculo(veiculo);
        coleta.setRota(rota);

        Coleta salva = coletaRepository.save(coleta);

        assertNotNull(salva.getCodigo());
        assertEquals("Concluida", salva.getStatus());
        assertNotNull(salva.getResiduo());
        assertNotNull(salva.getMotorista());
    }

    @Test
    void testInserirSimples() {
        Coleta coleta = new Coleta();
        coleta.setDataColeta(LocalDateTime.now());
        coleta.setQuantidadeColetada(100.0);
        coleta.setStatus("Pendente");
        coleta.setObservacao("Aguardando coleta");
        coleta.setDestino("Central de Triagem");

        Coleta salva = coletaRepository.save(coleta);

        assertNotNull(salva.getCodigo());
    }

    @Test
    void testListar() {
        Coleta c1 = new Coleta();
        c1.setDataColeta(LocalDateTime.now());
        c1.setQuantidadeColetada(200.0);
        c1.setStatus("Concluida");
        c1.setObservacao("ok");
        c1.setDestino("Aterro");
        coletaRepository.save(c1);

        Coleta c2 = new Coleta();
        c2.setDataColeta(LocalDateTime.now());
        c2.setQuantidadeColetada(150.0);
        c2.setStatus("Pendente");
        c2.setObservacao("Aguardando");
        c2.setDestino("Central");
        coletaRepository.save(c2);

        List<Coleta> lista = coletaRepository.findAll();
        assertFalse(lista.isEmpty());
    }

    @Test
    void testAtualizar() {
        Coleta coleta = new Coleta();
        coleta.setDataColeta(LocalDateTime.now());
        coleta.setQuantidadeColetada(80.0);
        coleta.setStatus("Pendente");
        coleta.setObservacao("Inicio da coleta");
        coleta.setDestino("Aterro Sanitario");
        Coleta salva = coletaRepository.save(coleta);

        salva.setStatus("Concluida");
        salva.setQuantidadeColetada(95.0);
        Coleta atualizada = coletaRepository.save(salva);

        assertEquals("Concluida", atualizada.getStatus());
        assertEquals(95.0, atualizada.getQuantidadeColetada());
    }

    @Test
    void testRemover() {
        Coleta coleta = new Coleta();
        coleta.setDataColeta(LocalDateTime.now());
        coleta.setQuantidadeColetada(50.0);
        coleta.setStatus("Cancelada");
        coleta.setObservacao("Cancelada por clima");
        coleta.setDestino("Nenhum");
        Coleta salva = coletaRepository.save(coleta);

        Long codigo = salva.getCodigo();
        coletaRepository.deleteById(codigo);

        Optional<Coleta> resultado = coletaRepository.findById(codigo);
        assertFalse(resultado.isPresent());
    }

    @Test
    void testBuscarPorStatus() {
        Coleta coleta = new Coleta();
        coleta.setDataColeta(LocalDateTime.now());
        coleta.setQuantidadeColetada(300.0);
        coleta.setStatus("Em andamento");
        coleta.setObservacao("Coleta em progresso");
        coleta.setDestino("Central de Triagem");
        coletaRepository.save(coleta);

        List<Coleta> resultado = coletaRepository.findByStatus("Em andamento");
        assertFalse(resultado.isEmpty());
    }

    @Test
    void testBuscarPorStatusLike() {
        Coleta coleta = new Coleta();
        coleta.setDataColeta(LocalDateTime.now());
        coleta.setQuantidadeColetada(120.0);
        coleta.setStatus("Concluida com ressalva");
        coleta.setObservacao("Alguns pontos nao atendidos");
        coleta.setDestino("Aterro");
        coletaRepository.save(coleta);

        List<Coleta> resultado = coletaRepository.buscarPorStatusLike("Concluida");
        assertFalse(resultado.isEmpty());
    }

    @Test
    void testQueryNativa() {
        Coleta coleta = new Coleta();
        coleta.setDataColeta(LocalDateTime.now());
        coleta.setQuantidadeColetada(400.0);
        coleta.setStatus("Concluida");
        coleta.setObservacao("Normal");
        coleta.setDestino("Aterro Sanitario Municipal");
        coletaRepository.save(coleta);

        List<Coleta> resultado = coletaRepository.buscarPorStatusLimitado("Concluida", 10);
        assertFalse(resultado.isEmpty());
    }
}
