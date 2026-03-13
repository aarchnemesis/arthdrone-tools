# organize_images.py - Função 1: Organizar imagens S&R (a partir do CSV)
# Wrapper CLI sobre api_functions.organizar_imagens_api

from colorama import Fore, Style
from utils import get_path_from_input
from translations import t
from api_functions import organizar_imagens_api


def _cli_log(msg, type_="info"):
    """Callback de log para modo CLI."""
    color = {
        "success": Fore.GREEN,
        "warning": Fore.YELLOW,
        "error": Fore.RED,
        "info": Fore.WHITE,
    }.get(type_, Fore.WHITE)
    print(color + msg + Style.RESET_ALL)


def organizar_imagens(lang="pt"):
    print(Fore.CYAN + f"\n=== {t('option_1', lang)} ===\n" + Style.RESET_ALL)

    csv_path = get_path_from_input(t("drag_csv", lang))
    if not csv_path:
        return

    fotos_dir = get_path_from_input(t("drag_photos", lang))
    if not fotos_dir or not fotos_dir.is_dir():
        return

    mode = input(t("mode_prompt", lang)).strip().upper() or "P"
    dry_raw = input(t("dry_prompt", lang)).strip().upper()
    dry = dry_raw in ("S", "Y")

    organizar_imagens_api(
        csv_path=str(csv_path),
        fotos_dir=str(fotos_dir),
        mode=mode,
        dry_run=dry,
        log_fn=_cli_log,
    )

    input(t("enter_to_return", lang))