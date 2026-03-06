# convert_csv.py - Função 2: Converter CSV (; → , + .xlsx opcional)

import pandas as pd
import csv  # ← adicionado aqui
from pathlib import Path
from colorama import Fore, Style

from utils import get_path_from_input
from translations import t

def converter_csv(lang="pt"):
    print(Fore.CYAN + f"\n=== {t('option_2', lang)} ===\n" + Style.RESET_ALL)

    csv_path = get_path_from_input(t("drag_csv", lang))
    if not csv_path or not csv_path.is_file(): return

    try:
        df = pd.read_csv(csv_path, sep=';', encoding='utf-8-sig')
    except Exception as e:
        print(Fore.RED + f"Erro ao ler CSV: {e}" + Style.RESET_ALL)
        return

    saida_csv = csv_path.with_name(f"{csv_path.stem}_convertido.csv")
    df.to_csv(saida_csv, index=False, sep=',', encoding='utf-8-sig', quoting=csv.QUOTE_ALL)
    print(Fore.GREEN + f"✔ CSV convertido: {saida_csv}" + Style.RESET_ALL)

    gerar_xlsx = input("Gerar também .xlsx? [S/N] (default N): ").strip().upper() == "S"
    if gerar_xlsx:
        saida_xlsx = csv_path.with_name(f"{csv_path.stem}_convertido.xlsx")
        df.to_excel(saida_xlsx, index=False)
        print(Fore.GREEN + f"✔ .xlsx gerado: {saida_xlsx}" + Style.RESET_ALL)

    input(t("enter_to_return", lang))