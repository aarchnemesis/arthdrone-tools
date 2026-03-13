# api_functions.py
# Versões _api de cada módulo — usam log_fn() no lugar de print()
# Os módulos originais (organize_images.py, etc.) não precisam ser alterados.

from pathlib import Path
import shutil
import json
import csv
import re
import pandas as pd
from utils import (
    SUPPORTED_EXTS, extract_gps_altitude, extract_dji_timestamp,
    format_location_for_name, format_mm_px
)


# ─── Helpers ──────────────────────────────────────────────────────────────────

def _normalize_filename(name: str) -> str:
    name = name.strip().lower()
    name = re.sub(r'\s+', ' ', name)
    name = re.sub(r'[^a-z0-9_\-\.]', '', name)
    stem, ext = Path(name).stem, Path(name).suffix.lower()
    return stem + ext

def _build_image_cache(folder: Path, log_fn) -> dict:
    cache = {}
    for img in folder.rglob("*"):
        if img.is_file() and img.suffix.upper() in SUPPORTED_EXTS:
            key = _normalize_filename(img.name)
            if key in cache:
                log_fn(f"⚠ Duplicado ignorado: {img.name}", "warning")
            else:
                cache[key] = img
    return cache


# ─── Módulo 1 — Organizar Imagens ─────────────────────────────────────────────

def _write_missing_file(output_dir: Path, missing: list, modulo: str):
    """Gera missing_data_YYYY-MM-DD_HHMMSS.txt na pasta OUTPUT."""
    from datetime import datetime
    ts = datetime.now().strftime("%Y-%m-%d_%H%M%S")
    out = output_dir / f"missing_data_{ts}.txt"
    with open(out, 'w', encoding='utf-8') as f:
        f.write(f"Arthdrone Tools — arquivos nao encontrados\n")
        f.write(f"Modulo: {modulo}\n")
        f.write(f"Data: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write(f"Total: {len(missing)} arquivo(s)\n")
        f.write("-" * 50 + "\n")
        for item in missing:
            f.write(f"{item}\n")
    return out.name

def organizar_imagens_api(csv_path: str, fotos_dir: str, mode: str, dry_run: bool, log_fn):
    csv_path = Path(csv_path)
    fotos_dir = Path(fotos_dir)
    output_dir = csv_path.parent / "OUTPUT"
    output_dir.mkdir(exist_ok=True)

    try:
        df = pd.read_csv(csv_path, sep=';', encoding='utf-8-sig')
    except Exception as e:
        log_fn(f"Erro ao ler CSV: {e}", "error")
        return

    # valida colunas obrigatorias
    required = {'Blade SN', 'Side', 'Original Image', 'Location', 'Pixel MM'}
    missing_cols = required - set(df.columns)
    if missing_cols:
        log_fn(f"CSV invalido — colunas ausentes: {', '.join(missing_cols)}", "error")
        return

    image_cache = _build_image_cache(fotos_dir, lambda msg, t: None)  # silencioso
    total = len(df)
    copied = 0
    missing = []

    for idx, row in df.iterrows():
        # Emitir progresso a cada 10 imagens ou na ultima
        if idx % 10 == 0 or idx == total - 1:
            log_fn(f"PROGRESS:{idx + 1}/{total}")

        blade    = str(row.get('Blade SN', '')).strip()
        blade    = re.sub(r'[\/*?:"<>|]', '', blade).strip()
        region   = str(row.get('Side', '')).strip().upper()
        location = row.get('Location', 0)
        pixel_mm = row.get('Pixel MM', 0)
        original = str(row.get('Original Image', '')).strip()

        norm = _normalize_filename(original)
        src  = image_cache.get(norm)

        if not src:
            missing.append(f"Linha {idx+2}: {original}")
            continue

        dest_dir = output_dir / blade / region
        dest_dir.mkdir(parents=True, exist_ok=True)

        if mode == "P":
            order      = idx + 1
            z_fmt      = format_location_for_name(location)
            mm_fmt     = format_mm_px(pixel_mm)
            clean_name = f"{blade}_{z_fmt}_{order}_{mm_fmt}.jpg"
        else:
            clean_name = Path(original).name

        dest_path = dest_dir / clean_name
        if not dry_run:
            shutil.copy2(src, dest_path)
        copied += 1

    # ── resumo final ──
    if dry_run:
        log_fn(f"[DRY-RUN] {copied}/{total} imagens seriam copiadas · {len(missing)} nao encontradas", "warning")
    elif len(missing) == 0:
        log_fn(f"{copied}/{total} imagens organizadas com sucesso", "success")
        log_fn(f"Output: {output_dir}", "info")
    else:
        log_fn(f"{copied}/{total} imagens organizadas · {len(missing)} nao encontradas", "warning")
        log_fn(f"Output: {output_dir}", "info")
        fname = _write_missing_file(output_dir, missing, "Organizar Imagens S&R")
        log_fn(f"Lista de ausentes salva em OUTPUT/{fname}", "warning")


# ─── Módulo 2 — Converter CSV ─────────────────────────────────────────────────

def converter_csv_api(csv_path: str, gerar_xlsx: bool, log_fn):
    csv_path = Path(csv_path)

    try:
        df = pd.read_csv(csv_path, sep=';', encoding='utf-8-sig')
    except Exception as e:
        log_fn(f"❌ Erro ao ler CSV: {e}", "error")
        return

    saida_csv = csv_path.with_name(f"{csv_path.stem}_convertido.csv")
    df.to_csv(saida_csv, index=False, sep=',', encoding='utf-8-sig', quoting=csv.QUOTE_ALL)
    log_fn(f"✔ CSV convertido: {saida_csv.name}", "success")

    if gerar_xlsx:
        saida_xlsx = csv_path.with_name(f"{csv_path.stem}_convertido.xlsx")
        df.to_excel(saida_xlsx, index=False)
        log_fn(f"✔ .xlsx gerado: {saida_xlsx.name}", "success")


# ─── Módulo 3 — GPS + Z Relativo ──────────────────────────────────────────────

def carregar_fotos_gps_api(pasta: str, log_fn) -> list:
    """
    Etapa 1: varre a pasta, extrai altitude GPS de cada foto.
    Retorna lista de dicts {nome, altitude} ordenada por nome DJI.
    """
    pasta = Path(pasta)
    fotos = sorted(
        [p for p in pasta.rglob("*") if p.is_file() and p.suffix.upper() in SUPPORTED_EXTS],
        key=lambda p: p.name
    )

    if not fotos:
        log_fn("Nenhuma foto .JPG/.JPEG encontrada.", "error")
        return []

    resultado = []
    sem_gps = 0
    for img in fotos:
        alt = extract_gps_altitude(img)
        if alt is not None:
            resultado.append({"nome": img.name, "altitude": round(float(alt), 3)})
        else:
            sem_gps += 1

    log_fn(f"{len(resultado)} fotos com GPS | {sem_gps} sem GPS.", "info")
    return resultado


def extrair_gps_z_api(pasta: str, raiz_nome: str, log_fn):
    """
    Etapa 2: recebe a pasta e o nome da foto raiz escolhida pelo usuario.
    Gera o CSV com Z relativo a partir da altitude da raiz.
    """
    pasta = Path(pasta)
    fotos = sorted(
        [p for p in pasta.rglob("*") if p.is_file() and p.suffix.upper() in SUPPORTED_EXTS],
        key=lambda p: p.name
    )

    altitudes = {}
    for img in fotos:
        alt = extract_gps_altitude(img)
        if alt is not None:
            altitudes[img.name] = round(float(alt), 3)

    if raiz_nome not in altitudes:
        log_fn(f"Foto raiz '{raiz_nome}' nao encontrada ou sem GPS.", "error")
        return

    altitude_raiz = altitudes[raiz_nome]
    log_fn(f"Raiz (Z=0): {raiz_nome} ({altitude_raiz:.3f} m)", "info")

    resultados = []
    for nome, alt in sorted(altitudes.items(), key=lambda x: x[1]):
        z_rel = (alt - altitude_raiz) * 1000
        resultados.append({
            'nome': nome,
            'altitude_gps_m': round(float(alt), 3),
            'z_relativo_mm': round(float(z_rel))
        })

    df = pd.DataFrame(resultados)
    out = pasta / "gps_z_relativo.csv"
    df.to_csv(out, index=False)
    log_fn(f"gps_z_relativo.csv gerado ({len(df)} linhas)", "success")


# ─── Módulo 4 — Processar JSON ────────────────────────────────────────────────

def _get_dji_timestamp(item: dict):
    name = item.get('image_metadata', {}).get('original_file_name', '')
    return extract_dji_timestamp(name)

def process_json_api(json_path: str, log_fn):
    json_path   = Path(json_path)
    root_folder = json_path.parent

    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        log_fn(f"❌ Erro ao ler JSON: {e}", "error")
        return

    windblades = data.get('windblades', [])
    if not windblades:
        log_fn("❌ Nenhum windblade encontrado no JSON.", "error")
        return

    # Cache de imagens nas pastas A/B/C
    image_cache = {}
    for sub in ['A', 'B', 'C']:
        p = root_folder / sub
        if p.is_dir():
            for img in p.rglob("*"):
                if img.is_file() and img.suffix.upper() in SUPPORTED_EXTS:
                    image_cache[img.name.lower()] = img.absolute()

    log_fn(f"📁 {len(image_cache)} fotos encontradas.", "info")

    wind_farm    = data.get('wind_farm', '')
    turbine_name = data.get('turbine_name', '')
    turbine_id   = data.get('turbine_id', '')
    workorder_id = data.get('workorder_id', '')
    equipment_id = data.get('equipment_id', '')
    surface      = data.get('surface', '')

    groups = {}
    for item in windblades:
        key = f"{item['blade_position']}_{item['blade_sn']}"
        groups.setdefault(key, []).append(item)

    grouped     = {}
    matched_rows = []
    id_counter  = 1

    for key, items in groups.items():
        blade_position = items[0]['blade_position']
        blade_sn       = items[0]['blade_sn']
        by_region      = {}
        for item in items:
            by_region.setdefault(item.get('region', ''), []).append(item)

        rows = []
        for region, region_items in by_region.items():
            is_tip_to_root = region in ['SS', 'PS']
            region_items.sort(key=_get_dji_timestamp)
            if is_tip_to_root:
                region_items.reverse()

            for item in region_items:
                meta          = item.get('image_metadata', {})
                original_name = meta.get('original_file_name', '')
                location      = meta.get('location', '')
                pixel_size    = meta.get('pixel_size', '')
                matched_file  = image_cache.get(original_name.lower(), '')
                image_id_val  = (
                    str(matched_file).replace(str(root_folder), '').lstrip('/\\').replace('/', '\\')
                    if matched_file else ''
                )

                rows.append({
                    'id': id_counter, 'workorder': workorder_id,
                    'turbine': turbine_name, 'blade': blade_sn,
                    'region': region, 'image_id': image_id_val,
                    'distance_to_hub': location, 'gimbal_pos': 0,
                    'temperature': 0, 'timestamp': 0, 'mm_px': pixel_size
                })
                matched_rows.append({
                    'wind_farm': wind_farm, 'turbine_name': turbine_name,
                    'turbine_id': turbine_id, 'workorder_id': workorder_id,
                    'equipment_id': equipment_id, 'surface': surface,
                    'blade_position': blade_position, 'blade_sn': blade_sn,
                    'region': region,
                    'sequence_direction': 'TipToRoot' if is_tip_to_root else 'RootToTip',
                    'location': location,
                    'json_date_image_utc': meta.get('date_image', ''),
                    'json_original_file_name': original_name,
                    'json_image_file_path': meta.get('image_file_path', ''),
                    'expected_sequence': id_counter,
                    'matched_file': str(matched_file),
                    'matched_sequence': id_counter,
                    'sequence_match': 1, 'delta_seconds': 0, 'flag_far_match': 0
                })
                id_counter += 1
                log_fn(f"✔ {original_name}", "success")

        grouped[key] = rows

    for key, rows in grouped.items():
        df      = pd.DataFrame(rows)
        safe_key = re.sub(r'[\/*?:"<>|]', '', key).strip()
        out_csv = root_folder / f"photo_data_{safe_key}.csv"
        df.to_csv(out_csv, index=False, sep=',')
        log_fn(f"✔ Gerado: {out_csv.name}", "success")

    pd.DataFrame(matched_rows).to_csv(root_folder / "photo_data_matched.csv", index=False)
    log_fn("✔ photo_data_matched.csv gerado", "success")


# ─── Módulo 5 — Organizar Fotos pelo JSON ─────────────────────────────────────

def organizar_fotos_api(json_path: str, source_folder: str, log_fn):
    json_path     = Path(json_path)
    source_folder = Path(source_folder)
    root_folder   = json_path.parent
    output_dir    = root_folder  # missing_data vai na mesma pasta do JSON (raiz do OUTPUT)

    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        log_fn(f"Erro ao ler JSON: {e}", "error")
        return

    image_cache = {}
    for img in source_folder.rglob("*"):
        if img.is_file() and img.suffix.upper() in SUPPORTED_EXTS:
            image_cache[img.name.lower()] = img

    windblades = data.get('windblades', [])
    total  = len([w for w in windblades if w.get('image_metadata', {}).get('original_file_name')])
    copied = 0
    missing = []

    for i, item in enumerate(windblades):
        # Emitir progresso a cada 10 fotos ou na ultima
        if i % 10 == 0 or i == total - 1:
            log_fn(f"PROGRESS:{i + 1}/{total}")

        meta          = item.get('image_metadata', {})
        original_name = meta.get('original_file_name')
        target_path   = meta.get('image_file_path')

        if not original_name or not target_path:
            continue

        src = image_cache.get(original_name.lower())
        if not src:
            missing.append(original_name)
            continue

        relative  = Path(target_path).parts[-3:]
        dest_full = root_folder / Path(*relative) / original_name
        dest_full.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dest_full)
        copied += 1

    # ── resumo final ──
    if len(missing) == 0:
        log_fn(f"{copied}/{total} fotos organizadas com sucesso", "success")
        log_fn(f"Output: {root_folder}", "info")
    else:
        log_fn(f"{copied}/{total} fotos organizadas · {len(missing)} nao encontradas", "warning")
        log_fn(f"Output: {root_folder}", "info")
        fname = _write_missing_file(output_dir, missing, "Organizar Fotos via JSON")
        log_fn(f"Lista de ausentes salva em {fname}", "warning")