package br.edu.ifpr.bsi.residuos.storage;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class StorageService {

    private final Cloudinary cloudinary;

    public StorageService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    // faz upload para o Cloudinary e retorna a URL HTTPS da imagem já hospedada
    public String upload(String pasta, MultipartFile arquivo, String identificador) throws IOException {
        Map<?, ?> resultado = cloudinary.uploader().upload(
            arquivo.getBytes(),
            ObjectUtils.asMap(
                "folder", "residuos/" + pasta,
                // public_id fixo por identificador — se o usuário trocar a foto, sobrescreve a anterior
                "public_id", identificador,
                "overwrite", true
            )
        );
        // secure_url usa HTTPS; url seria HTTP — sempre preferir a versão segura
        return resultado.get("secure_url").toString();
    }
}
