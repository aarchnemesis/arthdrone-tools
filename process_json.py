# process_json.py - Função 4: Processar JSON → CSVs da pá

from pathlib import Path
import json
import pandas as pd
from datetime import datetime
from colorama import Fore, Style
from utils import SUPPORTED_EXTS
from utils import extract_dji_timestamp
from translations import t
from utils import get_path_from_input

def _get_dji_timestamp(item: dict):
    """Extrai timestamp DJI do nome do arquivo de um item windblade."""
    name = item.get('image_metadata', {}).get('original_file_name', '')
    return extract_dji_timestamp(name)


def process_json_para_csvs_api(lang="pt"):
    print(Fore.CYAN + f"\n=== {t('option_4', lang)} ===\n" + Style.RESET_ALL)

    json_path = get_path_from_input(t("json_drag", lang))
    if not json_path or not json_path.is_file(): return

    root_folder = json_path.parent
    print(Fore.BLUE + f"Pasta raiz: {root_folder}" + Style.RESET_ALL)

    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    wind_farm = data.get('wind_farm', '')
    turbine_name = data.get('turbine_name', '')
    turbine_id = data.get('turbine_id', '')
    workorder_id = data.get('workorder_id', '')
    equipment_id = data.get('equipment_id', '')
    surface = data.get('surface', '')

    windblades = data.get('windblades', [])

    if not windblades:
        print(Fore.RED + t("no_json", lang) + Style.RESET_ALL)
        return

    image_cache = {}
    for sub in ['A', 'B', 'C']:
        p = root_folder / sub
        if p.is_dir():
            for img in p.rglob("*"):
                if img.is_file() and img.suffix.upper() in SUPPORTED_EXTS:
                    image_cache[img.name.lower()] = img.absolute()

    print(Fore.GREEN + f"{len(image_cache)} fotos encontradas." + Style.RESET_ALL)

    grouped = {}
    matched_rows = []
    id_counter = 1

    groups = {}
    for item in windblades:
        key = f"{item['blade_position']}_{item['blade_sn']}"
        groups.setdefault(key, []).append(item)

    for key, items in groups.items():
        blade_position = items[0]['blade_position']
        blade_sn = items[0]['blade_sn']

        by_region = {}
        for item in items:
            region = item.get('region', '')
            by_region.setdefault(region, []).append(item)

        rows = []

        for region, region_items in by_region.items():
            is_tip_to_root = region in ['SS', 'PS']

            region_items.sort(key=_get_dji_timestamp)

            if is_tip_to_root:
                region_items.reverse()

            for item in region_items:
                meta = item.get('image_metadata', {})
                original_name = meta.get('original_file_name', '')
                location = meta.get('location', '')
                pixel_size = meta.get('pixel_size', '')

                matched_file = image_cache.get(original_name.lower(), '')
                image_id_value = str(matched_file).replace(str(root_folder), '').lstrip('/\\').replace('/', '\\') if matched_file else ''

                rows.append({
                    'id': id_counter,
                    'workorder': workorder_id,
                    'turbine': turbine_name,
                    'blade': blade_sn,
                    'region': region,
                    'image_id': image_id_value,
                    'distance_to_hub': location,
                    'gimbal_pos': 0,
                    'temperature': 0,
                    'timestamp': 0,
                    'mm_px': pixel_size
                })

                matched_rows.append({
                    'wind_farm': wind_farm,
                    'turbine_name': turbine_name,
                    'turbine_id': turbine_id,
                    'workorder_id': workorder_id,
                    'equipment_id': equipment_id,
                    'surface': surface,
                    'blade_position': blade_position,
                    'blade_sn': blade_sn,
                    'region': region,
                    'sequence_direction': 'TipToRoot' if is_tip_to_root else 'RootToTip',
                    'location': location,
                    'json_date_image_utc': meta.get('date_image', ''),
                    'json_original_file_name': original_name,
                    'json_image_file_path': meta.get('image_file_path', ''),
                    'expected_sequence': id_counter,
                    'matched_file': str(matched_file),
                    'matched_timestamp_utc': meta.get('date_image', ''),
                    'matched_sequence': id_counter,
                    'sequence_match': 1,
                    'delta_seconds': 0,
                    'flag_far_match': 0
                })

                id_counter += 1

        grouped[key] = rows

    for key, rows in grouped.items():
        df = pd.DataFrame(rows)
        csv_path = root_folder / f"photo_data_{key}.csv"
        df.to_csv(csv_path, index=False, sep=',')
        print(Fore.GREEN + f"✔ Gerado: {csv_path}" + Style.RESET_ALL)

    df_matched = pd.DataFrame(matched_rows)
    df_matched.to_csv(root_folder / "photo_data_matched.csv", index=False, sep=',')
    print(Fore.GREEN + f"✔ photo_data_matched.csv gerado" + Style.RESET_ALL)

    print(Fore.BLUE + "\n✅ Processamento concluído!" + Style.RESET_ALL)
    input(t("enter_to_return", lang))