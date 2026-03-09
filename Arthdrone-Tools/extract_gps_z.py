# extract_gps_z.py - Função 3: Extrair GPS + Z relativo (versão robusta)

from pathlib import Path
import pandas as pd
from colorama import Fore, Style

from utils import get_path_from_input, extract_gps_altitude, SUPPORTED_EXTS  # ← linha corrigida
from translations import t

def extrair_gps_z_api(lang="pt"):
    print(Fore.CYAN + f"\n=== {t('option_3', lang)} ===\n" + Style.RESET_ALL)

    pasta = get_path_from_input(t("drag_photos", lang))
    if not pasta or not pasta.is_dir(): return

    fotos = sorted([p for p in pasta.rglob("*") if p.is_file() and p.suffix.upper() in SUPPORTED_EXTS],
                   key=lambda p: p.name)

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
        print("Nenhuma foto com GPS válido.")
        return

    sorted_names = sorted(altitudes.keys())
    print("\nFotos com GPS (numeradas):")
    for i, nome in enumerate(sorted_names, 1):
        print(f"{i:3d} - {nome} ({altitudes[nome]:.3f} m)")

    raiz_input = input("\nDigite o número da foto da raiz (ex: 1) ou o nome completo (Z=0): ").strip()

    if raiz_input.isdigit():
        try:
            idx = int(raiz_input) - 1
            raiz_name = sorted_names[idx]
        except IndexError:
            print("Número inválido. Usando a primeira foto com GPS como fallback.")
            raiz_name = sorted_names[0]
    else:
        raiz_name = raiz_input

    if raiz_name not in altitudes:
        print(f"⚠ Foto '{raiz_name}' não tem GPS ou não encontrada. Usando primeira com GPS.")
        raiz_name = sorted_names[0]

    altitude_raiz = altitudes[raiz_name]
    print(f"Raiz selecionada: {raiz_name} ({altitude_raiz:.3f} m) → Z=0")

    resultados = []
    for nome, alt in altitudes.items():
        z_rel = (alt - altitude_raiz) * 1000
        resultados.append({
            'nome': nome,
            'altitude_gps_m': round(alt, 3),
            'z_relativo_mm': round(z_rel)
        })

    df = pd.DataFrame(resultados)
    df.to_csv(pasta / "gps_z_relativo.csv", index=False)
    print(Fore.GREEN + f"\n✔ gps_z_relativo.csv gerado ({len(df)} linhas)" + Style.RESET_ALL)

    input(t("enter_to_return", lang))