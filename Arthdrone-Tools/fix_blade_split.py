# fix_blade_split.py - Função 7: Corrigir fotos de duas pás misturadas (Blade Split)
# Wrapper CLI sobre fix_blade_split_api

from colorama import Fore, Style
from utils import get_path_from_input
from translations import t
from fix_blade_split_api import analisar_json_api, corrigir_blade_split_api, analisar_csv_api, corrigir_csv_api


def _cli_log(msg, type_="info"):
    """Callback de log para modo CLI."""
    color = {
        "success": Fore.GREEN,
        "warning": Fore.YELLOW,
        "error": Fore.RED,
        "info": Fore.WHITE,
    }.get(type_, Fore.WHITE)
    print(color + msg + Style.RESET_ALL)


def fix_blade_split_cli(lang="pt"):
    print(Fore.CYAN + f"\n=== {t('option_7', lang)} ===\n" + Style.RESET_ALL)
    print(Fore.YELLOW + "Essa função procura quebras de tempo (gaps) nas fotos de uma mesma posição (A, B ou C)." + Style.RESET_ALL)
    print(Fore.YELLOW + "Ideal para quando o drone registra duas pás seguidas na mesma pasta." + Style.RESET_ALL)

    json_path = get_path_from_input(t("json_drag", lang))
    if not json_path or not json_path.is_file() or json_path.suffix.lower() not in ['.json', '.csv']:
        print(Fore.RED + "Arquivo (JSON/CSV) não encontrado ou inválido." + Style.RESET_ALL)
        return

    # Usaremos 50 por exemplo (threshold baixo para sempre perguntar ao CLI caso ache gap considerável)
    # ou podemos ler da entrada do user...
    print("Digite o número mínimo de fotos para analisar um grupo (padrão: 800): ", end="")
    try:
        threshold = int(input().strip() or 800)
    except ValueError:
        threshold = 800

    _cli_log(f"Analisando grupos maiores que {threshold} fotos...", "info")
    
    is_csv = json_path.suffix.lower() == '.csv'
    
    if is_csv:
        suspeitos = analisar_csv_api(
            csv_path=str(json_path),
            threshold=threshold,
            log_fn=_cli_log
        )
    else:
        suspeitos = analisar_json_api(
            json_path=str(json_path),
            threshold=threshold,
            log_fn=_cli_log
        )

    if not suspeitos:
        _cli_log("Nenhum grupo suspeito detectado.", "success")
        input(t("enter_to_return", lang))
        return

    correcoes = []
    
    for s in suspeitos:
        pos = s['blade_position']
        fotos_totais = s['total_fotos']
        split_idx = s['split_index_sorted']
        gap_sec = s['gap_seconds']
        
        # Obter os nomes das duas fotos adjacentes na quebra para exibir
        p_antes = s['itens_com_tempo'][split_idx-1]
        p_depois = s['itens_com_tempo'][split_idx]
        foto_antes = p_antes['item'].get('image_metadata', {}).get('original_file_name', '')
        foto_depois = p_depois['item'].get('image_metadata', {}).get('original_file_name', '')
        
        print("\n" + "="*50)
        _cli_log(f"POSIÇÃO: {pos} | FOTOS: {fotos_totais}", "warning")
        _cli_log(f"Um salto temporal de {gap_sec} segundos foi encontrado!", "error")
        _cli_log(f"Entre as fotos: {foto_antes} e {foto_depois}", "error")
        _cli_log(f"Isso significa que {fotos_totais - split_idx} fotos pertencem à segunda sessão.", "info")
        
        print(f"\nDeseja dividir o JSON neste ponto? [S/N] (padrão S): ", end="")
        escolha = input().strip().lower()
        if escolha and escolha != 's':
            _cli_log("Ignorando este grupo.", "warning")
            continue
            
        nova_pos = input(f"Digite a nova posição [A, B, C] para as {fotos_totais - split_idx} fotos (padrão B): ").strip().upper()
        if not nova_pos:
            nova_pos = 'B'
            
        novo_sn = input(f"Digite o Serial Number (SN) da nova pá as {fotos_totais - split_idx} fotos: ").strip()
        
        correcoes.append({
            'blade_position': pos,
            'novo_blade_position': nova_pos,
            'novo_blade_sn': novo_sn,
            'itens_com_tempo': s['itens_com_tempo'],
            'split_index_sorted': split_idx
        })

    if correcoes:
        if is_csv:
            corrigir_csv_api(
                csv_path=str(json_path),
                correcoes=correcoes,
                log_fn=_cli_log
            )
        else:
            corrigir_blade_split_api(
                json_path=str(json_path),
                correcoes=correcoes,
                log_fn=_cli_log
            )
    else:
        _cli_log("Nenhuma correção foi aplicada.", "warning")

    input(t("enter_to_return", lang))
