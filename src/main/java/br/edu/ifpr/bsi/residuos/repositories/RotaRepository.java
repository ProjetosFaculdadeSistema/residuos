package br.edu.ifpr.bsi.residuos.repositories;

import br.edu.ifpr.bsi.residuos.model.rota.Rota;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RotaRepository extends JpaRepository<Rota, Long> {

    List<Rota> findByNome(String nome);

    List<Rota> findByBairro(String bairro);

    @Query(value = "SELECT r FROM Rota r WHERE r.cidade LIKE %:cidade%")
    List<Rota> buscarPorCidadeLike(@Param("cidade") String cidade);

    @Query(nativeQuery = true, value = "SELECT * FROM tb_rota WHERE dia_semana = :dia LIMIT :limit")
    List<Rota> buscarPorDiaSemanaLimitado(@Param("dia") String dia, @Param("limit") int limit);
}
