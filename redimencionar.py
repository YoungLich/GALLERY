from PIL import Image
import os

# Caminho da pasta com as imagens
input_folder = r"C:\Users\User\OneDrive\Área de Trabalho\GALLERY\images\desktop"
output_folder = r"C:\Users\User\OneDrive\Área de Trabalho\GALLERY\images\desktop"
nova_largura = 1920
nova_altura = 1180

# Cria a pasta de saída, se não existir
os.makedirs(output_folder, exist_ok=True)

# Itera por todas as imagens na pasta
for filename in os.listdir(input_folder):
    if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
        caminho_original = os.path.join(input_folder, filename)
        caminho_novo = os.path.join(output_folder, filename)

        with Image.open(caminho_original) as img:
            # Redimensiona com crop central para manter proporção exata
            img_ratio = img.width / img.height
            target_ratio = nova_largura / nova_altura

            if img_ratio > target_ratio:
                # Imagem é mais larga que a proporção alvo
                new_height = nova_altura
                new_width = int(nova_altura * img_ratio)
            else:
                # Imagem é mais alta que a proporção alvo
                new_width = nova_largura
                new_height = int(nova_largura / img_ratio)

            img_resized = img.resize((new_width, new_height), Image.LANCZOS)

            # Crop central para exatamente 1920x1080
            left = (new_width - nova_largura) // 2
            top = (new_height - nova_altura) // 2
            right = left + nova_largura
            bottom = top + nova_altura
            img_cropped = img_resized.crop((left, top, right, bottom))

            img_cropped.save(caminho_novo)
            print(f"Salvo: {caminho_novo}")
