package br.edu.ifpr.bsi.residuos.repositories;

import br.edu.ifpr.bsi.residuos.model.veiculo.Veiculo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VeiculoRepository extends JpaRepository<Veiculo, Long> {

    List<Veiculo> findByPlaca(String placa);

    List<Veiculo> findByTipo(String tipo);

    @Query(value = "SELECT v FROM Veiculo v WHERE v.modelo LIKE %:modelo%")
    List<Veiculo> buscarPorModeloLike(@Param("modelo") String modelo);

    @Query(nativeQuery = true, value = "SELECT * FROM tb_veiculo WHERE tipo_veiculo = :tipo LIMIT :limit")
    List<Veiculo> buscarPorTipoLimitado(@Param("tipo") String tipo, @Param("limit") int limit);
}
