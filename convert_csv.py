
import pandas as pd
import csv  # ← adicionado aqui
from pathlib import Path
from colorama import Fore, Style

from utils import get_path_from_input
from translations import t

def converter_csv_api(csv_path: str, gerar_xlsx: bool, log_fn):
    """Versão para GUI — usa log_fn() no lugar de print()."""
    from pathlib import Path
    import pandas as pd
    import csv

    try:
        df = pd.read_csv(csv_path, sep=';', encoding='utf-8-sig')
    except Exception as e:
        log_fn(f"❌ Erro ao ler CSV: {e}", "error")
        return

    saida_csv = Path(csv_path).with_name(
        Path(csv_path).stem + "_convertido.csv"
    )
    df.to_csv(saida_csv, index=False, sep=',',
              encoding='utf-8-sig', quoting=csv.QUOTE_ALL)
    log_fn(f"✔ CSV convertido: {saida_csv}", "success")

    if gerar_xlsx:
        saida_xlsx = Path(csv_path).with_name(
            Path(csv_path).stem + "_convertido.xlsx"
        )
        df.to_excel(saida_xlsx, index=False)
        log_fn(f"✔ .xlsx gerado: {saida_xlsx}", "success")

