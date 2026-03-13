# process_json.py - Função 4: Processar JSON → CSVs da pá
# Wrapper CLI sobre api_functions.process_json_api

from colorama import Fore, Style
from utils import get_path_from_input
from translations import t
from api_functions import process_json_api


def _cli_log(msg, type_="info"):
    """Callback de log para modo CLI."""
    color = {
        "success": Fore.GREEN,
        "warning": Fore.YELLOW,
        "error": Fore.RED,
        "info": Fore.WHITE,
    }.get(type_, Fore.WHITE)
    print(color + msg + Style.RESET_ALL)


def process_json_para_csvs(lang="pt"):
    print(Fore.CYAN + f"\n=== {t('option_4', lang)} ===\n" + Style.RESET_ALL)

    json_path = get_path_from_input(t("json_drag", lang))
    if not json_path or not json_path.is_file():
        return

    process_json_api(
        json_path=str(json_path),
        log_fn=_cli_log,
    )

    print(Fore.BLUE + "\nProcessamento concluido!" + Style.RESET_ALL)
    input(t("enter_to_return", lang))