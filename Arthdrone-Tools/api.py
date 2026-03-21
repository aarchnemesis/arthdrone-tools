# api.py - Bridge entre o React (frontend) e o Python (backend)

import threading
import webview
from api_functions import (
    organizar_imagens_api,
    converter_csv_api,
    carregar_fotos_gps_api,
    extrair_gps_z_api,
    process_json_api,
    organizar_fotos_api,
    corrigir_z_zero_csv_api
)
from fix_blade_split_api import analisar_json_api, corrigir_blade_split_api, analisar_csv_api, corrigir_csv_api


class ArthdroneAPI:
    def __init__(self, window_ref):
        self._window = window_ref

    # ─── Utilitário interno ───────────────────────────────────────────────────

    def _emit(self, event: str, payload: dict):
        import json
        safe = json.dumps(payload).replace("'", "\\'")
        self._window.evaluate_js(
            f"window.dispatchEvent(new CustomEvent('{event}', {{detail: {safe}}}))"
        )

    def _log(self, msg: str, type_: str = "info"):
        # Detecta mensagens de progresso no formato PROGRESS:current/total
        import re
        progress_match = re.match(r'^PROGRESS:(\d+)/(\d+)$', msg)
        if progress_match:
            current = int(progress_match.group(1))
            total = int(progress_match.group(2))
            self._emit("arthprogress", {"current": current, "total": total})
            return  # nao loga mensagens de progresso puras
        self._emit("arthlog", {"text": msg, "type": type_})

    # ─── Seleção de arquivos/pastas ──────────────────────────────────────────

    def pick_file(self, file_type: str = "all"):
        """Abre diálogo nativo para selecionar arquivo com filtro por tipo.
        file_type: 'csv' | 'json' | 'all'
        """
        type_map = {
            "csv":  ("CSV (*.csv)", "*.csv"),
            "json": ("JSON (*.json)", "*.json"),
            "all":  ("Todos os arquivos (*.*)", "*.*"),
        }
        label, pattern = type_map.get(file_type, type_map["all"])
        result = self._window.create_file_dialog(
            webview.OPEN_DIALOG,
            allow_multiple=False,
            file_types=(f"{label}",)
        )
        return result[0] if result else ""

    def pick_folder(self):
        """Abre diálogo nativo para selecionar pasta. Retorna caminho ou ''."""
        try:
            result = self._window.create_file_dialog(webview.FileDialog.FOLDER)
        except AttributeError:
            result = self._window.create_file_dialog(webview.FOLDER_DIALOG)
        return result[0] if result else ""

    def open_folder(self, path: str):
        """Abre a pasta no gerenciador de arquivos nativo (Windows/Linux/macOS)."""
        import subprocess, os, sys
        try:
            if sys.platform == "win32":
                if os.path.isdir(path):
                    subprocess.Popen(f'explorer "{path}"')
                elif os.path.isfile(path):
                    subprocess.Popen(f'explorer /select,"{path}"')
            elif sys.platform == "darwin":
                subprocess.Popen(["open", path])
            else:
                # Linux — xdg-open funciona com qualquer file manager
                subprocess.Popen(["xdg-open", path])
        except Exception:
            pass

    # ─── Módulo 1 — Organizar Imagens ────────────────────────────────────────

    def organizar_imagens(self, csv_path: str, fotos_dir: str, mode: str, dry_run: bool):
        def run():
            try:
                organizar_imagens_api(csv_path=csv_path, fotos_dir=fotos_dir,
                                      mode=mode, dry_run=dry_run, log_fn=self._log)
            except Exception as e:
                self._log(f"Erro inesperado: {e}", "error")
            finally:
                self._emit("arthdone", {})
        threading.Thread(target=run, daemon=True).start()

    # ─── Módulo 2 — Converter CSV ────────────────────────────────────────────

    def converter_csv(self, csv_path: str, gerar_xlsx: bool):
        def run():
            try:
                converter_csv_api(csv_path=csv_path, gerar_xlsx=gerar_xlsx, log_fn=self._log)
            except Exception as e:
                self._log(f"Erro inesperado: {e}", "error")
            finally:
                self._emit("arthdone", {})
        threading.Thread(target=run, daemon=True).start()

    # ─── Módulo 3 — GPS + Z Relativo ─────────────────────────────────────────

    def carregar_fotos_gps(self, fotos_dir: str):
        """Etapa 1: varre pasta e retorna lista de fotos com GPS para o JS."""
        def run():
            try:
                fotos = carregar_fotos_gps_api(pasta=fotos_dir, log_fn=self._log)
            except Exception as e:
                self._log(f"Erro inesperado: {e}", "error")
                fotos = []
            finally:
                self._emit("gps_fotos_loaded", {"fotos": fotos})
        threading.Thread(target=run, daemon=True).start()

    def extrair_gps_z(self, fotos_dir: str, raiz_nome: str):
        """Etapa 2: gera CSV usando a foto raiz escolhida pelo usuario."""
        def run():
            try:
                extrair_gps_z_api(pasta=fotos_dir, raiz_nome=raiz_nome, log_fn=self._log)
            except Exception as e:
                self._log(f"Erro inesperado: {e}", "error")
            finally:
                self._emit("arthdone", {})
        threading.Thread(target=run, daemon=True).start()

    # ─── Módulo 4 — Processar JSON ───────────────────────────────────────────

    def processar_json(self, json_path: str):
        def run():
            try:
                process_json_api(json_path=json_path, log_fn=self._log)
            except Exception as e:
                self._log(f"Erro inesperado: {e}", "error")
            finally:
                self._emit("arthdone", {})
        threading.Thread(target=run, daemon=True).start()

    # ─── Módulo 5 — Organizar Fotos ──────────────────────────────────────────

    def organizar_fotos(self, json_path: str, fotos_dir: str):
        def run():
            try:
                organizar_fotos_api(json_path=json_path, source_folder=fotos_dir, log_fn=self._log)
            except Exception as e:
                self._log(f"Erro inesperado: {e}", "error")
            finally:
                self._emit("arthdone", {})
        threading.Thread(target=run, daemon=True).start()

    # ─── Módulo 7 — Corrigir Blade Split ─────────────────────────────────────

    def analisar_blade_split(self, file_path: str, threshold: int = 800):
        def run():
            try:
                if str(file_path).lower().endswith('.csv'):
                    resultados = analisar_csv_api(csv_path=file_path, threshold=threshold, log_fn=self._log)
                else:
                    resultados = analisar_json_api(json_path=file_path, threshold=threshold, log_fn=self._log)
                    
                # Convert datetime inside resultados before emit
                safe_resultados = []
                for s in resultados:
                    novo_s = s.copy()
                    itens_safe = []
                    for i in novo_s['itens_com_tempo']:
                        i_safe = i.copy()
                        i_safe['dt'] = str(i_safe['dt'])
                        itens_safe.append(i_safe)
                    novo_s['itens_com_tempo'] = itens_safe
                    safe_resultados.append(novo_s)
            except Exception as e:
                self._log(f"Erro inesperado: {e}", "error")
                safe_resultados = []
            finally:
                self._emit("blade_split_analise", {"suspeitos": safe_resultados})
                self._emit("arthdone", {})
        threading.Thread(target=run, daemon=True).start()

    def corrigir_blade_split(self, file_path: str, correcoes: list):
        def run():
            try:
                if str(file_path).lower().endswith('.csv'):
                    corrigir_csv_api(csv_path=file_path, correcoes=correcoes, log_fn=self._log)
                else:
                    corrigir_blade_split_api(json_path=file_path, correcoes=correcoes, log_fn=self._log)
            except Exception as e:
                self._log(f"Erro inesperado: {e}", "error")
            finally:
                self._emit("arthdone", {})
        threading.Thread(target=run, daemon=True).start()
    # ─── Módulo 8 — Corrigir Z Zero CSV ──────────────────────────────────────
    
    def corrigir_z_zero(self, csv_path: str, fotos_dir: str, raiz_nome: str):
        def run():
            try:
                corrigir_z_zero_csv_api(csv_path=csv_path, fotos_dir=fotos_dir, raiz_nome=raiz_nome, log_fn=self._log)
            except Exception as e:
                self._log(f"Erro inesperado: {e}", "error")
            finally:
                self._emit("arthdone", {})
        threading.Thread(target=run, daemon=True).start()

    # ─── Módulo 9 — Recuperar Fotos Perdidas ─────────────────────────────────
    
    def recuperar_fotos_perdidas(self, json_path: str, fotos_dir: str):
        def run():
            try:
                from api_functions import recuperar_fotos_perdidas_api
                recuperar_fotos_perdidas_api(json_path=json_path, fotos_dir=fotos_dir, log_fn=self._log)
            except Exception as e:
                self._log(f"Erro inesperado: {e}", "error")
            finally:
                self._emit("arthdone", {})
        threading.Thread(target=run, daemon=True).start()
