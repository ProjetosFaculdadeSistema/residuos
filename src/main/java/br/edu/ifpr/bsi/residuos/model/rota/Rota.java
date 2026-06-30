package br.edu.ifpr.bsi.residuos.model.rota;

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
@Table(name = "tb_rota")
public class Rota extends GenericModel {

    @Column(name = "nome_rota")
    private String nome;

    @Column(name = "bairro_rota")
    private String bairro;

    @Column(name = "cidade_rota")
    private String cidade;

    @Column(name = "distancia_km")
    private Double distanciaKm;

    @Column(name = "dia_semana")
    private String diaSemana;

    // Pontos de geolocalização da rota — orphanRemoval pois são parte integrante da rota
    @OneToMany(mappedBy = "rota",
               cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE},
               orphanRemoval = true,
               fetch = FetchType.LAZY)
    @OrderBy("ordem ASC")
    private List<PontoColeta> pontos = new ArrayList<>();

    // Coletas históricas — sem orphanRemoval (registro histórico)
    @JsonIgnore
    @OneToMany(mappedBy = "rota", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.LAZY)
    private List<Coleta> coletas = new ArrayList<>();
}
