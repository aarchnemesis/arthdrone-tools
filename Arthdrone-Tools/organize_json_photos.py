# organize_json_photos.py - Função 5: Organizar fotos usando JSON como mapa
# Wrapper CLI sobre api_functions.organizar_fotos_api

from colorama import Fore, Style
from utils import get_path_from_input
from translations import t
from api_functions import organizar_fotos_api


def _cli_log(msg, type_="info"):
    """Callback de log para modo CLI."""
    color = {
        "success": Fore.GREEN,
        "warning": Fore.YELLOW,
        "error": Fore.RED,
        "info": Fore.WHITE,
    }.get(type_, Fore.WHITE)
    print(color + msg + Style.RESET_ALL)


def organizar_fotos_pelo_json(lang="pt"):
    print(Fore.CYAN + f"\n=== {t('option_5', lang)} ===\n" + Style.RESET_ALL)

    json_path = get_path_from_input(t("json_drag", lang))
    if not json_path or not json_path.is_file():
        print(Fore.RED + "JSON nao encontrado ou invalido." + Style.RESET_ALL)
        return

    source_folder = get_path_from_input(t("drag_photos", lang))
    if not source_folder or not source_folder.is_dir():
        print(Fore.RED + "Pasta de fotos nao encontrada ou invalida." + Style.RESET_ALL)
        return

    organizar_fotos_api(
        json_path=str(json_path),
        source_folder=str(source_folder),
        log_fn=_cli_log,
    )

    input(t("enter_to_return", lang))