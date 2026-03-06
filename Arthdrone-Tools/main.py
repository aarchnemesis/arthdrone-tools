# main.py - Launcher principal do Arthdrone Tools v2.1

import sys

try:
    from colorama import Fore, Style, init
    init(autoreset=True)
except ImportError:
    class Dummy:
        def __getattr__(self, _): return ""
    Fore = Style = Dummy()

# Imports
from translations import t
from organize_images import organizar_imagens
from convert_csv import converter_csv
from extract_gps_z import extrair_gps_z
from process_json import process_json_para_csvs
from organize_json_photos import organizar_fotos_pelo_json
from documentation import documentacao

def mostrar_menu(lang="pt"):
    print(Fore.CYAN + "\n" + "="*60 + Style.RESET_ALL)
    print(Fore.YELLOW + f"          {t('menu_title', lang)}" + Style.RESET_ALL)
    print(Fore.CYAN + "="*60 + Style.RESET_ALL)
    print(Fore.GREEN + t("option_1", lang) + Style.RESET_ALL)
    print(Fore.GREEN + t("option_2", lang) + Style.RESET_ALL)
    print(Fore.GREEN + t("option_3", lang) + Style.RESET_ALL)
    print(Fore.GREEN + t("option_4", lang) + Style.RESET_ALL)
    print(Fore.GREEN + t("option_5", lang) + Style.RESET_ALL)
    print(Fore.GREEN + t("option_6", lang) + Style.RESET_ALL)
    print(Fore.RED + t("option_0", lang) + Style.RESET_ALL)
    print("\nDigite o número: ", end="")

def main():
    # Escolha de idioma
    print(t("choose_language"))
    print(t("lang_pt"))
    print(t("lang_en"))
    escolha = input("> ").strip()
    lang = "en" if escolha == "2" else "pt"

    while True:
        mostrar_menu(lang)
        opcao = input().strip()

        if opcao == "1":
            organizar_imagens(lang)
        elif opcao == "2":
            converter_csv(lang)
        elif opcao == "3":
            extrair_gps_z(lang)
        elif opcao == "4":
            process_json_para_csvs(lang)
        elif opcao == "5":
            organizar_fotos_pelo_json(lang)
        elif opcao == "6":
            documentacao(lang)
        elif opcao == "0":
            print(Fore.YELLOW + t("exit_message", lang) + Style.RESET_ALL)
            sys.exit(0)
        else:
            print(Fore.RED + ("Opção inválida." if lang == "pt" else "Invalid option.") + Style.RESET_ALL)

if __name__ == "__main__":
    main()