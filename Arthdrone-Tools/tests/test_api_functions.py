# tests/test_api_functions.py — Testes unitários para api_functions.py

import sys
import os
import tempfile
import csv
from pathlib import Path

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from api_functions import converter_csv_api, organizar_imagens_api


# ─── Helpers ──────────────────────────────────────────────────────────────────

class LogCapture:
    """Captura mensagens de log para verificação em testes."""
    def __init__(self):
        self.messages = []

    def __call__(self, msg, type_="info"):
        self.messages.append({"text": msg, "type": type_})

    def has_type(self, type_):
        return any(m["type"] == type_ for m in self.messages)

    def has_text(self, text):
        return any(text in m["text"] for m in self.messages)


# ─── converter_csv_api ────────────────────────────────────────────────────────

def test_converter_csv_basic():
    """Testa conversão básica de CSV com ; para ,"""
    log = LogCapture()
    with tempfile.TemporaryDirectory() as tmpdir:
        # Criar CSV de teste com separador ;
        csv_path = Path(tmpdir) / "test.csv"
        with open(csv_path, "w", encoding="utf-8-sig", newline="") as f:
            writer = csv.writer(f, delimiter=";")
            writer.writerow(["col1", "col2", "col3"])
            writer.writerow(["a", "b", "c"])
            writer.writerow(["d", "e", "f"])

        converter_csv_api(str(csv_path), gerar_xlsx=False, log_fn=log)

        # Verificar que o CSV convertido foi criado
        output_csv = csv_path.with_name("test_convertido.csv")
        assert output_csv.exists(), "CSV convertido nao foi criado"
        assert log.has_type("success"), "Nenhuma mensagem de sucesso"

        # Verificar conteúdo do CSV convertido
        with open(output_csv, "r", encoding="utf-8-sig") as f:
            reader = csv.reader(f, delimiter=",")
            rows = list(reader)
            assert len(rows) == 3  # header + 2 linhas
            assert rows[0] == ["col1", "col2", "col3"]


def test_converter_csv_invalid_file():
    """Testa erro ao ler arquivo inexistente."""
    log = LogCapture()
    converter_csv_api("nao_existe.csv", gerar_xlsx=False, log_fn=log)
    assert log.has_type("error"), "Deveria ter gerado erro"


def test_converter_csv_with_xlsx():
    """Testa geração opcional de .xlsx."""
    log = LogCapture()
    with tempfile.TemporaryDirectory() as tmpdir:
        csv_path = Path(tmpdir) / "test.csv"
        with open(csv_path, "w", encoding="utf-8-sig", newline="") as f:
            writer = csv.writer(f, delimiter=";")
            writer.writerow(["col1"])
            writer.writerow(["val1"])

        converter_csv_api(str(csv_path), gerar_xlsx=True, log_fn=log)

        output_xlsx = csv_path.with_name("test_convertido.xlsx")
        assert output_xlsx.exists(), ".xlsx nao foi gerado"


# ─── organizar_imagens_api — validação de colunas ─────────────────────────────

def test_organizar_imagens_missing_columns():
    """Testa que colunas ausentes geram erro."""
    log = LogCapture()
    with tempfile.TemporaryDirectory() as tmpdir:
        # CSV com colunas erradas
        csv_path = Path(tmpdir) / "bad.csv"
        with open(csv_path, "w", encoding="utf-8-sig", newline="") as f:
            writer = csv.writer(f, delimiter=";")
            writer.writerow(["wrong_col1", "wrong_col2"])
            writer.writerow(["a", "b"])

        fotos_dir = Path(tmpdir) / "fotos"
        fotos_dir.mkdir()

        organizar_imagens_api(
            csv_path=str(csv_path),
            fotos_dir=str(fotos_dir),
            mode="P",
            dry_run=True,
            log_fn=log,
        )

        assert log.has_type("error"), "Deveria ter gerado erro por colunas ausentes"
        assert log.has_text("colunas ausentes"), "Mensagem deveria mencionar colunas ausentes"
