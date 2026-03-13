# convert_csv.py - Função 2: Converter CSV
# Wrapper CLI sobre api_functions.converter_csv_api

from colorama import Fore, Style
from utils import get_path_from_input
from translations import t
from api_functions import converter_csv_api


def _cli_log(msg, type_="info"):
    """Callback de log para modo CLI."""
    color = {
        "success": Fore.GREEN,
        "warning": Fore.YELLOW,
        "error": Fore.RED,
        "info": Fore.WHITE,
    }.get(type_, Fore.WHITE)
    print(color + msg + Style.RESET_ALL)


def converter_csv(lang="pt"):
    print(Fore.CYAN + f"\n=== {t('option_2', lang)} ===\n" + Style.RESET_ALL)

    csv_path = get_path_from_input(t("drag_csv", lang))
    if not csv_path:
        return

    xlsx_raw = input("Gerar .xlsx? [S/N] (default N): ").strip().upper()
    gerar_xlsx = xlsx_raw in ("S", "Y")

    converter_csv_api(
        csv_path=str(csv_path),
        gerar_xlsx=gerar_xlsx,
        log_fn=_cli_log,
    )

    input(t("enter_to_return", lang))
