package br.edu.ifpr.bsi.residuos.repositories;

import br.edu.ifpr.bsi.residuos.model.residuo.Residuo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResiduoRepository extends JpaRepository<Residuo, Long> {

    List<Residuo> findByNome(String nome);

    List<Residuo> findByTipo(String tipo);

    @Query(value = "SELECT r FROM Residuo r WHERE r.nome LIKE %:nome%")
    List<Residuo> buscarPorNomeLike(@Param("nome") String nome);

    @Query(nativeQuery = true, value = "SELECT * FROM tb_residuo WHERE tipo_residuo = :tipo LIMIT :limit")
    List<Residuo> buscarPorTipoLimitado(@Param("tipo") String tipo, @Param("limit") int limit);
}
