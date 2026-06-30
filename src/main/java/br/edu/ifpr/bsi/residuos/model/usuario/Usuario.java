package br.edu.ifpr.bsi.residuos.model.usuario;

import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

// implementa UserDetails para que o Spring Security consiga usar essa entidade
// diretamente no processo de autenticação, sem precisar de um wrapper separado
@Entity
@Table(name = "usuarios")
public class Usuario implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    // email é o "username" nesse sistema — único por definição
    @Column(nullable = false, unique = true)
    private String email;

    // a senha é armazenada já com hash BCrypt, nunca em texto puro
    @Column(nullable = false)
    private String senha;

    // URL da imagem no Cloudinary; pode ser null se o usuário não enviou foto
    private String foto;

    public Usuario() {}

    public Usuario(String nome, String email, String senha, String foto) {
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.foto = foto;
    }

    public Long getId() { return id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }
    public String getFoto() { return foto; }
    public void setFoto(String foto) { this.foto = foto; }

    // todos os usuários têm o mesmo papel por enquanto; expandir aqui se precisar de admin
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public String getPassword() { return senha; }

    // o Spring Security chama getUsername() para identificar o principal — usamos email
    @Override
    public String getUsername() { return email; }

    // controles de bloqueio/expiração de conta; todos true porque não implementamos essa lógica ainda
    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return true; }
}
