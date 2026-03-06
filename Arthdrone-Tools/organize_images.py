# organize_images.py - Função 1: Organizar imagens S&R (a partir do CSV)

from pathlib import Path
import pandas as pd
import shutil
import re
from colorama import Fore, Style
from utils import SUPPORTED_EXTS
from utils import get_path_from_input, find_image, SUPPORTED_EXTS, format_location_for_name, format_mm_px, normalize_column_names
from translations import t

def normalize_filename(name: str) -> str:
    name = name.strip().lower()
    name = re.sub(r'\s+', ' ', name)
    name = re.sub(r'[^a-z0-9_\-\.]', '', name)
    stem, ext = Path(name).stem, Path(name).suffix.lower()
    return stem + ext

def organizar_imagens(lang="pt"):
    print(Fore.CYAN + f"\n=== {t('option_1', lang)} ===\n" + Style.RESET_ALL)

    csv_path = get_path_from_input(t("drag_csv", lang))
    if not csv_path: return

    output_dir = csv_path.parent / "OUTPUT"

    fotos_dir = get_path_from_input(t("drag_photos", lang))
    if not fotos_dir or not fotos_dir.is_dir(): return

    mode = input(t("mode_prompt", lang)).strip().upper() or "P"
    dry = input(t("dry_prompt", lang)).strip().upper() == "S"

    output_dir.mkdir(exist_ok=True)

    try:
        df = pd.read_csv(csv_path, sep=';', encoding='utf-8-sig')
    except Exception as e:
        print(Fore.RED + f"Erro ao ler CSV: {e}" + Style.RESET_ALL)
        return

    # Cache com normalização máxima
    image_cache = {}
    for img in fotos_dir.rglob("*"):
        if img.is_file() and img.suffix.upper() in SUPPORTED_EXTS:
            norm_name = normalize_filename(img.name)
            if norm_name in image_cache:
                print(Fore.YELLOW + f"Duplicado ignorado: {img.name}" + Style.RESET_ALL)
            else:
                image_cache[norm_name] = img

    print(Fore.GREEN + f"Encontrados {len(image_cache)} fotos no cache." + Style.RESET_ALL)

    copied = 0
    for idx, row in df.iterrows():
        blade = str(row.get('Blade SN', '')).strip()
        region = str(row.get('Side', '')).strip().upper()
        location = row.get('Location', 0)
        pixel_mm = row.get('Pixel MM', 0)
        original = str(row.get('Original Image', '')) .strip()

        norm_original = normalize_filename(original)
        src = image_cache.get(norm_original)

        if not src:
            print(Fore.RED + f"❌ NÃO ENCONTRADO (linha {idx+1}): {original} (normalizado: {norm_original})" + Style.RESET_ALL)
            continue

        dest_dir = output_dir / blade / region
        dest_dir.mkdir(parents=True, exist_ok=True)

        if mode == "P":
            order = idx + 1  # simples, ou use extract_picture_order(original) se quiser do nome DJI
            z_formatted = format_location_for_name(location)
            mm_px_formatted = format_mm_px(pixel_mm)
            clean_name = f"{blade}_{z_formatted}_{order}_{mm_px_formatted}.jpg"
        else:
            clean_name = Path(original).name

        dest_path = dest_dir / clean_name
        if not dry:
            shutil.copy2(src, dest_path)
        copied += 1

    print(Fore.GREEN + f"✔ {copied} imagens organizadas em OUTPUT/ (ao lado do CSV)" + Style.RESET_ALL)
    input(t("enter_to_return", lang))