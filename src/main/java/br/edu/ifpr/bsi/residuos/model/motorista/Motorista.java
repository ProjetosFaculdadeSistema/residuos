package br.edu.ifpr.bsi.residuos.model.motorista;

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
@Table(name = "tb_motorista")
public class Motorista extends GenericModel {

    @Column(name = "nome_motorista")
    private String nome;

    @Column(name = "cnh_motorista")
    private String cnh;

    @Column(name = "telefone_motorista")
    private String telefone;

    @Column(name = "status_motorista")
    private String status;

    @Column(name = "categoria_cnh")
    private String categoriaCnh;

    @Column(name = "foto_motorista")
    private String foto;

    @JsonIgnore
    @OneToMany(mappedBy = "motorista", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.LAZY)
    private List<Coleta> coletas = new ArrayList<>();
}
