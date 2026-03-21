import json
import csv
import pandas as pd
from pathlib import Path
from utils import extract_dji_timestamp

def analisar_json_api(json_path: str, threshold: int, log_fn) -> list:
    """
    Lê o JSON, agrupa por blade_position, e encontra o maior gap temporal
    em grupos que têm mais fotos que o threshold.
    """
    json_path = Path(json_path)
    
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        log_fn(f"Erro ao ler JSON: {e}", "error")
        return []

    windblades = data.get('windblades', [])
    if not windblades:
        log_fn("Nenhum windblade encontrado no JSON.", "error")
        return []

    # Agrupar itens por blade_position (guardando referências para indexação caso precise, mas para analisar podemos gerar a quebra)
    grupos = {}
    for i, item in enumerate(windblades):
        pos = item.get('blade_position', 'UNKNOWN')
        if pos not in grupos:
            grupos[pos] = []
        grupos[pos].append((i, item))

    suspeitos = []
    
    for pos, itens in grupos.items():
        if len(itens) > threshold:
            log_fn(f"Posição {pos} tem {len(itens)} fotos (suspeito > {threshold}). Calculando gaps...", "warning")
            
            # Ordenar os itens pelo timestamp para calcular o gap
            # Usando extract_dji_timestamp do nome do arquivo original
            itens_com_tempo = []
            for original_idx, item in itens:
                meta = item.get('image_metadata', {})
                name = meta.get('original_file_name', '')
                dt = extract_dji_timestamp(name)
                itens_com_tempo.append({
                    'original_idx': original_idx,
                    'dt': dt
                })
            
            # Ordena por timestamp
            # Cuidado com datetime.min caso a extração falhe
            itens_com_tempo.sort(key=lambda x: x['dt'])
            
            maior_gap = 0
            split_index = -1
            split_dt = None
            
            for i in range(1, len(itens_com_tempo)):
                t0 = itens_com_tempo[i-1]['dt']
                t1 = itens_com_tempo[i]['dt']
                
                # Ignorar falhas de parsing (datetime.min)
                if t0.year == 1 or t1.year == 1:
                    continue
                    
                gap = (t1 - t0).total_seconds()
                if gap > maior_gap:
                    maior_gap = gap
                    split_index = i
                    split_dt = t1
                    
            if split_index != -1 and maior_gap > 60:  # Gap mínimo considerável (> 60 seg)
                log_fn(f"-> Maior gap em {pos}: {maior_gap} segundos. Pode ser a quebra.", "warning")
                suspeitos.append({
                    'blade_position': pos,
                    'total_fotos': len(itens),
                    'split_index_sorted': split_index, # Índice da quebra no array ordenado
                    'gap_seconds': maior_gap,
                    'itens_com_tempo': itens_com_tempo # Para uso interno na correção
                })
                
    if not suspeitos:
        log_fn("Nenhuma posição parece misturada ou os gaps temporais são normais.", "success")
        
    return suspeitos

def corrigir_blade_split_api(json_path: str, correcoes: list, log_fn):
    """
    Aplica as correções (divisão do array) no JSON original e salva um _corrigido.json.
    correcoes é uma lista com dicionários:
    {
      'blade_position': 'A',
      'novo_blade_position': 'B',
      'novo_blade_sn': 'SN_12345',
      'itens_com_tempo': [...],
      'split_index_sorted': 450
    }
    """
    json_path = Path(json_path)
    
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        log_fn(f"Erro ao ler JSON: {e}", "error")
        return

    windblades = data.get('windblades', [])
    mudancas = 0
    
    for correcao in correcoes:
        pos_original = correcao['blade_position']
        nova_pos = correcao['novo_blade_position']
        novo_sn = correcao['novo_blade_sn']
        split_idx = correcao['split_index_sorted']
        itens_com_tempo = correcao['itens_com_tempo']
        
        # O segundo grupo (do split_idx em diante) é o que vai mudar de posição
        grupo_a_mudar = itens_com_tempo[split_idx:]
        
        for item_info in grupo_a_mudar:
            orig_idx = item_info['original_idx']
            wb_item = windblades[orig_idx]
            
            # Atualiza raiz do objeto
            blade_sn_antigo = wb_item.get('blade_sn', '')
            wb_item['blade_position'] = nova_pos
            wb_item['blade_sn'] = novo_sn
            
            # Atualizar os diretórios dentro de image_file_path (ex: FolderA/ -> FolderB/ ou A_nomedapa/ -> B_nova_pa/)
            meta = wb_item.get('image_metadata', {})
            old_path = meta.get('image_file_path', '')
            
            if old_path:
                # O path original tem algo como /A_bladeSN/ ou /A/. Podemos usar replace básico
                # mas de forma mais inteligente:
                # Substituimos "pos_original + _ + bla" por "nova_pos + _ + novo_sn" apenas se for padrão
                # Ou substituímos a substring com o blade_position
                
                # Uma heurística básica (pois sabemos como o ArthDrone organiza as pastas no celular):
                # .../A_123456/... -> .../B_789012/...
                str_find = f"{pos_original}_{blade_sn_antigo}"
                str_repl = f"{nova_pos}_{novo_sn}"
                
                new_path = old_path.replace(str_find, str_repl)
                meta['image_file_path'] = new_path
                
            mudancas += 1
            
    if mudancas > 0:
        out_file = json_path.with_name(f"{json_path.stem}_corrigido.json")
        with open(out_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
            
        log_fn(f"Correção aplicada! {mudancas} fotos movidas.", "success")
        log_fn(f"Salvo como: {out_file.name}", "success")
    else:
        log_fn("Nenhuma mudança foi aplicada.", "info")

def analisar_csv_api(csv_path: str, threshold: int, log_fn) -> list:
    """
    Analisa CSV gerado pela plataforma, agrupa pelo 'Blade SN' e busca
    gaps de tempo no 'Original Image'.
    """
    p_csv = Path(csv_path)
    try:
        df = pd.read_csv(p_csv, sep=';', encoding='utf-8-sig')
        if len(df.columns) == 1 and ',' in df.columns[0]:
            df = pd.read_csv(p_csv, sep=',', encoding='utf-8-sig')
            log_fn("Delimitador ',' detectado no CSV (ex: LibreOffice). Ajustando leitura automaticamente...", "info")
    except Exception as e:
        log_fn(f"Erro ao ler CSV: {e}", "error")
        return []

    if 'Blade SN' not in df.columns or 'Original Image' not in df.columns:
        log_fn("CSV inválido. Colunas 'Blade SN' e 'Original Image' necessárias.", "error")
        return []

    grupos = {}
    for i, row in df.iterrows():
        blade_sn = str(row['Blade SN']).strip()
        if blade_sn not in grupos:
            grupos[blade_sn] = []
        grupos[blade_sn].append((i, row))

    suspeitos = []
    
    for sn, itens in grupos.items():
        if len(itens) > threshold:
            log_fn(f"Pá {sn} tem {len(itens)} fotos (suspeito > {threshold}). Calculando gaps...", "warning")
            
            itens_com_tempo = []
            for original_idx, row in itens:
                name = str(row['Original Image']).strip()
                dt = extract_dji_timestamp(name)
                itens_com_tempo.append({
                    'original_idx': int(original_idx), # converte numpy int64 para python int nativo
                    'dt': dt
                })
                
            itens_com_tempo.sort(key=lambda x: x['dt'])
            
            maior_gap = 0
            split_index = -1
            
            for i in range(1, len(itens_com_tempo)):
                t0 = itens_com_tempo[i-1]['dt']
                t1 = itens_com_tempo[i]['dt']
                
                if t0.year == 1 or t1.year == 1:
                    continue
                    
                gap = (t1 - t0).total_seconds()
                if gap > maior_gap:
                    maior_gap = gap
                    split_index = i
                    
            if split_index != -1 and maior_gap > 60:
                log_fn(f"-> Maior gap na pá {sn}: {maior_gap} segundos. Pode ser a quebra.", "warning")
                suspeitos.append({
                    'blade_position': str(sn), # cast seguro para int e string 
                    'total_fotos': int(len(itens)),
                    'split_index_sorted': int(split_index),
                    'gap_seconds': float(maior_gap),
                    'itens_com_tempo': itens_com_tempo
                })
                
    if not suspeitos:
        log_fn("Nenhuma posição parece misturada ou os gaps temporais são normais.", "success")
        
    return suspeitos

def corrigir_csv_api(csv_path: str, correcoes: list, log_fn):
    """
    Remove linhas divididas do CSV original e gera novos arquivos CSVs para cada nova pá (SN).
    """
    p_csv = Path(csv_path)
    try:
        df = pd.read_csv(p_csv, sep=';', encoding='utf-8-sig')
        if len(df.columns) == 1 and ',' in df.columns[0]:
            df = pd.read_csv(p_csv, sep=',', encoding='utf-8-sig')
            log_fn("Delimitador ',' detectado. Corrigindo leitura automaticamente...", "info")
    except Exception as e:
        log_fn(f"Erro ao ler CSV: {e}", "error")
        return

    mudancas = 0
    linhas_para_remover = []
    
    # Previne erro de dtype ('value 100 for dtype int64')
    if 'Blade SN' in df.columns:
        df['Blade SN'] = df['Blade SN'].astype(str)
        
    for correcao in correcoes:
        novo_sn = correcao['novo_blade_sn']
        split_idx = correcao['split_index_sorted']
        itens_com_tempo = correcao['itens_com_tempo']
        
        grupo_a_mudar = itens_com_tempo[split_idx:]
        indices_a_mudar = [item['original_idx'] for item in grupo_a_mudar]
        
        if indices_a_mudar:
            # 1. Copia as linhas divididas para um novo DataFrame
            df_novo = df.loc[indices_a_mudar].copy()
            # 2. Atualiza o Blade SN
            df_novo['Blade SN'] = novo_sn
            
            # 3. Salva em um arquivo SEPARADO
            out_novo = p_csv.with_name(f"{p_csv.stem}_split_{novo_sn}.csv")
            df_novo.to_csv(out_novo, index=False, sep=';', encoding='utf-8-sig', quoting=csv.QUOTE_ALL)
            log_fn(f"✔ Criado CSV separado p/ SN {novo_sn}: {out_novo.name}", "success")
            
            # 4. Registra quais indices devem ser removidos do CSV 'original'
            linhas_para_remover.extend(indices_a_mudar)
            mudancas += 1
            
    if mudancas > 0:
        # 5. Salva o CSV original MENOS as fotos transplantadas
        df_restante = df.drop(index=linhas_para_remover)
        out_file = p_csv.with_name(f"{p_csv.stem}_corrigido.csv")
        df_restante.to_csv(out_file, index=False, sep=';', encoding='utf-8-sig', quoting=csv.QUOTE_ALL)
        log_fn(f"✔ CSV Original higienizado salvo em: {out_file.name}", "success")
    else:
        log_fn("Nenhuma mudança foi aplicada.", "info")

