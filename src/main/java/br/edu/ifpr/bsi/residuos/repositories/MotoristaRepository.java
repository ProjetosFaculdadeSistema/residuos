package br.edu.ifpr.bsi.residuos.repositories;

import br.edu.ifpr.bsi.residuos.model.motorista.Motorista;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MotoristaRepository extends JpaRepository<Motorista, Long> {

    List<Motorista> findByNome(String nome);

    List<Motorista> findByCnh(String cnh);

    @Query(value = "SELECT m FROM Motorista m WHERE m.nome LIKE %:nome%")
    List<Motorista> buscarPorNomeLike(@Param("nome") String nome);

    @Query(nativeQuery = true, value = "SELECT * FROM tb_motorista WHERE status_motorista = :status LIMIT :limit")
    List<Motorista> buscarPorStatusLimitado(@Param("status") String status, @Param("limit") int limit);
}
