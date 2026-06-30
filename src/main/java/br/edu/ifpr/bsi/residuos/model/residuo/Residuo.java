package br.edu.ifpr.bsi.residuos.model.residuo;

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
@Table(name = "tb_residuo")
public class Residuo extends GenericModel {

    @Column(name = "nome_residuo")
    private String nome;

    @Column(name = "tipo_residuo")
    private String tipo;

    @Column(name = "descricao_residuo")
    private String descricao;

    @Column(name = "periculosidade_residuo")
    private String periculosidade;

    @Column(name = "unidade_medida")
    private String unidadeMedida;

    @Column(name = "quantidade_residuo")
    private Double quantidade;

    @Column(name = "imagem_url")
    private String imagem;

    @JsonIgnore
    @OneToMany(mappedBy = "residuo", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.LAZY)
    private List<Coleta> coletas = new ArrayList<>();
}
