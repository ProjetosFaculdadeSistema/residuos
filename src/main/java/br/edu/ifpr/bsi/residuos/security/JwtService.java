package br.edu.ifpr.bsi.residuos.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
public class JwtService {

    // a chave secreta fica no application.properties para não entrar no repositório
    @Value("${jwt.secret}")
    private String secret;

    public String gerarToken(String email) {
        return JWT.create()
                // o subject é o email — serve como identificador do usuário dentro do token
                .withSubject(email)
                .withIssuedAt(Instant.now())
                // token válido por 24h; se precisar de "lembrar de mim" basta aumentar aqui
                .withExpiresAt(Instant.now().plus(24, ChronoUnit.HOURS))
                // HMAC256 é simétrico — o mesmo secret assina e verifica
                .sign(Algorithm.HMAC256(secret));
    }

    // retorna o email do usuário se o token for válido, null caso contrário
    public String validarToken(String token) {
        try {
            return JWT.require(Algorithm.HMAC256(secret))
                    .build()
                    .verify(token)
                    .getSubject();
        } catch (JWTVerificationException e) {
            // qualquer problema (expirado, assinatura errada, malformado) resulta em null
            return null;
        }
    }
}
