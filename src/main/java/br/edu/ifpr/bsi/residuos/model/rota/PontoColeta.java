package br.edu.ifpr.bsi.residuos.model.rota;

import br.edu.ifpr.bsi.residuos.model.GenericModel;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "tb_ponto_coleta")
public class PontoColeta extends GenericModel {

    @Column(name = "latitude", nullable = false)
    private Double latitude;

    @Column(name = "longitude", nullable = false)
    private Double longitude;

    @Column(name = "ordem")
    private Integer ordem;

    @Column(name = "nome", length = 100)
    private String nome;

    @ManyToOne
    @JoinColumn(name = "rota_id")
    @JsonIgnore
    private Rota rota;
}
