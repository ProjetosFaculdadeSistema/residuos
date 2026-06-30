package br.edu.ifpr.bsi.residuos.repositories;

import br.edu.ifpr.bsi.residuos.model.coleta.Coleta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ColetaRepository extends JpaRepository<Coleta, Long> {

    List<Coleta> findByStatus(String status);

    List<Coleta> findByDestino(String destino);

    @Query(value = "SELECT c FROM Coleta c WHERE c.status LIKE %:status%")
    List<Coleta> buscarPorStatusLike(@Param("status") String status);

    @Query(nativeQuery = true, value = "SELECT * FROM tb_coleta WHERE status_coleta = :status LIMIT :limit")
    List<Coleta> buscarPorStatusLimitado(@Param("status") String status, @Param("limit") int limit);
}
