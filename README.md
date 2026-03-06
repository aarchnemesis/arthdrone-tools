# Arthdrone Tools v1.0

Ferramenta interna em Python para automação de **S&R** (Sort & Rank) em inspeções de pás eólicas com drones DJI. Otimiza o fluxo entre ArtDrone e Arthnex/Clobotics: ordena fotos, corrige Z zerado, processa JSON, converte CSVs, organiza pastas. Reduz tempo de processamento de 18 para 9 minutos por aerogerador, dobrando produtividade diária.

Desenvolvida para uso interno, com foco em precisão e velocidade. Modular (cada função em arquivo separado), bilíngue (PT-BR/EN), com colorama para visual em terminais compatíveis.

## Status
- Versão: 1.0
- Uso principal: Windows (equipe de inspeção)
- Acesso: Repositório privado (somente colaboradores convidados)
- Binário Windows: Disponível na Release v2.1 (zip com exe + lib)

## Como usar (para o usuário final)

1. Baixe a Release v1.0 (zip da pasta build)
2. Descompacte a pasta inteira em qualquer lugar (ex: Desktop ou pendrive)
3. Clique duas vezes em `main.exe` (ou `ArthdroneTools.exe` se renomeado)
4. Janela preta abre com o menu:
5. Escolha o idioma / Choose language:
1 - Português (Brasil)
2 - English
5. Digite 1 ou 2 → menu principal aparece
6. Digite o número da opção desejada (1 a 6)
7. Arraste arquivos/pastas para a janela preta quando solicitado (funciona como no terminal)

## Funções Detalhadas

1. Organizar imagens S&R (a partir do CSV)  
Lê CSV da plataforma e copia fotos para OUTPUT/Blade/Region (criada na pasta do CSV arrastado).  
Modo P (default): renomeia para Blade_Z_Order_mm_px.jpg  
Modo R: mantém nome original DJI  
Dry-run: testa sem copiar (S para ativar)  
Arraste CSV → arraste pasta com fotos → escolha modo.

2. Converter CSV  
Converte CSV separado por ; para , (compatível com Excel).  
Gera .xlsx opcional.  
Arraste CSV → S/N para .xlsx.

3. Extrair GPS + Z relativo (referência raiz)  
Extrai altitude GPS do EXIF das fotos.  
Usa foto da raiz escolhida como Z=0.  
Gera gps_z_relativo.csv na pasta das fotos.  
Arraste pasta das fotos → escolha raiz.

4. Processar JSON → CSVs da pá  
Lê JSON do drone e gera CSVs para Image Uploader.  
Ordena por timestamp DJI + inversão para TipToRoot em SS/PS.  
Preenche image_id com caminho relativo.  
Arraste JSON.

5. Organizar fotos usando JSON como mapa  
Lê JSON do drone e cria pastas A/B/C.  
Copia fotos brutas para os caminhos indicados no JSON.  
Arraste JSON → arraste pasta das fotos brutas.

6. Documentação  
Mostra este guia completo.

## Limitações e Red Flags

- Terminal puro: janela preta visível (input e arrastar funcionam)
- Match de nomes: case-insensitive, mas espaços extras ou extensão diferente podem falhar — verifique antes.
- GPS: depende de EXIF das fotos DJI — neblina ou erro de drone pode zerar Z.
- mm/px: não calculado automaticamente — use média por modelo de pá ou recolheta.
- Erros comuns: pasta vazia, coluna de imagem vazia no CSV, nomes com caminho completo.

## Download e Uso

- Baixe o zip da Release v2.1 (pasta com main.exe + lib)
- Descompacte em qualquer lugar
- Clique em main.exe → janela preta abre com menu
- Teste em PC sem Python: funciona sem instalação.

## GitHub / Acesso

- Repositório privado: só colaboradores convidados acessam o código fonte.
- Releases: binário zipado para Windows (acesso restrito ao repo).
- Contato: mensagem direta ou issue no repo (acesso restrito).

Desenvolvido por Pedro Oliveira (@aarchnemesis)  
Última atualização: Março 2026
