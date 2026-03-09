# organize_json_photos.py - Função 5: Organizar fotos usando JSON como mapa

from pathlib import Path
import json
import shutil
from colorama import Fore, Style
from utils import SUPPORTED_EXTS
from utils import get_path_from_input
from translations import t

def organizar_fotos_pelo_json_api(lang="pt"):
    print(Fore.CYAN + f"\n=== {t('option_5', lang)} ===\n" + Style.RESET_ALL)

    json_path = get_path_from_input(t("json_drag", lang))
    if not json_path or not json_path.is_file():
        print(Fore.RED + "JSON não encontrado ou inválido." + Style.RESET_ALL)
        return

    source_folder = get_path_from_input(t("drag_photos", lang))
    if not source_folder or not source_folder.is_dir():
        print(Fore.RED + "Pasta de fotos não encontrada ou inválida." + Style.RESET_ALL)
        return

    root_folder = json_path.parent

    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    image_cache = {}
    for img in source_folder.rglob("*"):
        if img.is_file() and img.suffix.upper() in SUPPORTED_EXTS:
            image_cache[img.name.lower()] = img

    copied = 0
    for item in data.get('windblades', []):
        meta = item.get('image_metadata', {})
        original_name = meta.get('original_file_name')
        target_path_str = meta.get('image_file_path')

        if not original_name or not target_path_str:
            continue

        src = image_cache.get(original_name.lower())
        if not src:
            print(Fore.RED + f"❌ Não encontrado: {original_name}" + Style.RESET_ALL)
            continue

        relative = Path(target_path_str).parts[-3:]
        dest_full = root_folder / Path(*relative) / original_name
        dest_full.parent.mkdir(parents=True, exist_ok=True)

        shutil.copy2(src, dest_full)
        print(Fore.GREEN + f"Copiado: {original_name}" + Style.RESET_ALL)
        copied += 1

    print(Fore.BLUE + f"\n✅ {copied} fotos organizadas!" + Style.RESET_ALL)
    input(t("enter_to_return", lang))