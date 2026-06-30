package br.edu.ifpr.bsi.residuos.model.veiculo;

import br.edu.ifpr.bsi.residuos.model.GenericModel;
import br.edu.ifpr.bsi.residuos.model.coleta.Coleta;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "tb_veiculo")
public class Veiculo extends GenericModel {

    @Column(name = "placa_veiculo")
    private String placa;

    @Column(name = "modelo_veiculo")
    private String modelo;

    @Column(name = "capacidade_veiculo")
    private Double capacidade;

    @Column(name = "tipo_veiculo")
    private String tipo;

    @Column(name = "ano_veiculo")
    private Integer ano;

    @Column(name = "foto_veiculo")
    private String foto;

    @JsonIgnore
    @OneToMany(mappedBy = "veiculo", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.LAZY)
    private List<Coleta> coletas = new ArrayList<>();
}
