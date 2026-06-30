package br.edu.ifpr.bsi.residuos.model.coleta;

import br.edu.ifpr.bsi.residuos.model.GenericModel;
import br.edu.ifpr.bsi.residuos.model.motorista.Motorista;
import br.edu.ifpr.bsi.residuos.model.residuo.Residuo;
import br.edu.ifpr.bsi.residuos.model.rota.Rota;
import br.edu.ifpr.bsi.residuos.model.veiculo.Veiculo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "tb_coleta")
public class Coleta extends GenericModel {

    @Column(name = "data_coleta")
    private LocalDateTime dataColeta;

    @Column(name = "quantidade_coletada")
    private Double quantidadeColetada;

    @Column(name = "status_coleta")
    private String status;

    @Column(name = "observacao_coleta")
    private String observacao;

    @Column(name = "destino_coleta")
    private String destino;

    @ManyToOne
    @JoinColumn(name = "residuo_id")
    @JsonIgnore
    private Residuo residuo;

    @ManyToOne
    @JoinColumn(name = "motorista_id")
    @JsonIgnore
    private Motorista motorista;

    @ManyToOne
    @JoinColumn(name = "veiculo_id")
    @JsonIgnore
    private Veiculo veiculo;

    @ManyToOne
    @JoinColumn(name = "rota_id")
    @JsonIgnore
    private Rota rota;
}
