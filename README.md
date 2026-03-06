Funções Detalhadas
Cada opção resolve uma dor específica no fluxo de S&R. Uso: arraste arquivos/pastas para o prompt (funciona em terminais modernos).

Organizar imagens S&R (a partir do CSV)
Lê CSV da plataforma (colunas: Blade SN, Location, Pixel MM, Side, Original Image).
Copia fotos da pasta indicada para OUTPUT/Blade/Region (criada ao lado do CSV arrastado).
Modo P (default): renomeia para Blade_Z_Order_mm_px.jpg (Z de Location, mm_px de Pixel MM, Order = linha do CSV).
Modo R: mantém nome original DJI.
Dry-run: testa sem copiar (S para ativar).
Exemplo: Arraste CSV → arraste pasta com fotos → mode P → OUTPUT gerado com fotos renomeadas e organizadas por blade/region.
Útil para upload manual quando piloto falha ou fotos repetidas misturadas.
Limitação: Match case-insensitive, mas espaços extras no CSV podem falhar — verifique nomes.

Converter CSV
Converte CSV separado por ; para , (compatível com Excel).
Gera .xlsx opcional.
Arraste CSV → S/N para .xlsx.
Exemplo: CSV da plataforma com ; → convertido para , + .xlsx ao lado.
Útil para análise rápida no Excel sem quebras de linha.

Extrair GPS + Z relativo (referência raiz)
Extrai altitude GPS do EXIF das fotos.
Usa foto da raiz escolhida como Z=0 (digite número ou nome).
Gera gps_z_relativo.csv na pasta das fotos, com Z relativo em mm.
Arraste pasta das fotos.
Exemplo: Lista fotos com GPS → escolha raiz → CSV com nome, altitude GPS, Z relativo.
Útil para corrigir Z zerado ou incompleto no JSON/CSVs da plataforma.
Limitação: Fotos sem EXIF GPS são ignoradas (DJI salva altitude, mas neblina ou erro de drone pode falhar).

Processar JSON → CSVs da pá
Lê JSON do drone e gera CSVs para Image Uploader.
Ordena por timestamp DJI + inversão para TipToRoot em SS/PS.
Preenche image_id com caminho relativo.
Arraste JSON.
Exemplo: JSON do drone → gera photo_data_A.csv, B, C, matched.csv na pasta do JSON.
Útil para upload quando piloto falha ou repetições misturadas.
Limitação: JSON incompleto gera CSVs vazios — recolheta se possível.

Organizar fotos usando JSON como mapa
Lê JSON do drone e cria pastas A/B/C.
Copia fotos brutas para os caminhos indicados no JSON (image_file_path).
Arraste JSON → arraste pasta das fotos brutas.
Exemplo: JSON + pasta DJI → fotos copiadas para A/B/C com nomes originais.
Útil para recuperação quando upload falha completamente.
Limitação: Não renomeia — mantém nome DJI.

Documentação
Mostra este guia bilíngue completo.
Sem input.
Exemplo: Abre texto com explicação de cada função, dicas e limitações.
Útil para o time entender o tool sem ler código.


Limitações

Sem GUI: terminal puro (arrastar arquivos funciona, mas CMD clássico não tem cores — use Windows Terminal).
Dependências: Python + libs (pandas, pillow, colorama) — empacotamento gera standalone.
Match de nomes: case-insensitive, mas espaços extras ou caracteres unicode no CSV podem falhar — verifique antes.
GPS: depende de EXIF das fotos DJI — neblina ou erro de drone pode zerar Z.
mm/px: não calculado (ainda) — use média por modelo de pá ou recolheta.

Empacotamento

Windows (pasta exe + lib): cx_Freeze (pip install cx-freeze, rode python setup.py build)
Onefile: Nuitka (pip install nuitka ziglang, rode python -m nuitka --standalone --onefile main.py)
Linux: Nuitka para .bin standalone
