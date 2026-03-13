# extract_gps_z.py - Função 3: Extrair GPS + Z relativo
# Wrapper CLI sobre api_functions

from colorama import Fore, Style
from utils import get_path_from_input, SUPPORTED_EXTS, extract_gps_altitude
from translations import t
from api_functions import extrair_gps_z_api


def _cli_log(msg, type_="info"):
    """Callback de log para modo CLI."""
    color = {
        "success": Fore.GREEN,
        "warning": Fore.YELLOW,
        "error": Fore.RED,
        "info": Fore.WHITE,
    }.get(type_, Fore.WHITE)
    print(color + msg + Style.RESET_ALL)


def extrair_gps_z(lang="pt"):
    print(Fore.CYAN + f"\n=== {t('option_3', lang)} ===\n" + Style.RESET_ALL)

    pasta = get_path_from_input(t("drag_photos", lang))
    if not pasta or not pasta.is_dir():
        return

    # Etapa 1: mostrar fotos com GPS para o usuario escolher a raiz
    fotos = sorted(
        [p for p in pasta.rglob("*") if p.is_file() and p.suffix.upper() in SUPPORTED_EXTS],
        key=lambda p: p.name,
    )

    if not fotos:
        print("Nenhuma foto encontrada.")
        return

    altitudes = {}
    sem_gps = []

    print("Lendo GPS de todas as fotos...")
    for img in fotos:
        alt = extract_gps_altitude(img)
        if alt is not None:
            altitudes[img.name] = alt
        else:
            sem_gps.append(img.name)

    print(f"\nFotos com GPS: {len(altitudes)}")
    print(f"Fotos sem GPS: {len(sem_gps)}")

    if len(altitudes) == 0:
        print("Nenhuma foto com GPS valido.")
        return

    sorted_names = sorted(altitudes.keys())
    print("\nFotos com GPS (numeradas):")
    for i, nome in enumerate(sorted_names, 1):
        print(f"{i:3d} - {nome} ({altitudes[nome]:.3f} m)")

    raiz_input = input("\nDigite o numero da foto da raiz (ex: 1) ou o nome completo (Z=0): ").strip()

    if raiz_input.isdigit():
        try:
            idx = int(raiz_input) - 1
            raiz_name = sorted_names[idx]
        except IndexError:
            print("Numero invalido. Usando a primeira foto com GPS como fallback.")
            raiz_name = sorted_names[0]
    else:
        raiz_name = raiz_input

    if raiz_name not in altitudes:
        print(f"Foto '{raiz_name}' nao tem GPS ou nao encontrada. Usando primeira com GPS.")
        raiz_name = sorted_names[0]

    # Etapa 2: gerar CSV usando api_functions
    extrair_gps_z_api(
        pasta=str(pasta),
        raiz_nome=raiz_name,
        log_fn=_cli_log,
    )

    input(t("enter_to_return", lang))