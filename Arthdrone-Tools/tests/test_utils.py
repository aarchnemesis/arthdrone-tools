# tests/test_utils.py — Testes unitários para utils.py e helpers de api_functions.py

import sys
import os
from pathlib import Path
from datetime import datetime

# Adiciona o diretório raiz ao path para importar os módulos
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils import format_mm_px, format_location_for_name, extract_dji_timestamp, normalize_column_names
from api_functions import _normalize_filename
import pandas as pd


# ─── format_mm_px ──────────────────────────────────────────────────────────────

def test_format_mm_px_normal():
    assert format_mm_px(0.12345) == "0_12345"

def test_format_mm_px_zero():
    assert format_mm_px(0.0) == "0_00000"

def test_format_mm_px_large():
    assert format_mm_px(123.456789) == "123_45679"

def test_format_mm_px_invalid_string():
    assert format_mm_px("abc") == "UNKNOWN"

def test_format_mm_px_none():
    assert format_mm_px(None) == "UNKNOWN"


# ─── format_location_for_name ──────────────────────────────────────────────────

def test_format_location_int():
    assert format_location_for_name(42) == 42

def test_format_location_float():
    assert format_location_for_name(42.7) == 42

def test_format_location_string():
    assert format_location_for_name("15.3") == 15

def test_format_location_invalid():
    assert format_location_for_name("abc") == -1

def test_format_location_none():
    assert format_location_for_name(None) == -1


# ─── extract_dji_timestamp ────────────────────────────────────────────────────

def test_extract_dji_timestamp_valid():
    result = extract_dji_timestamp("DJI_20240315143201_001.JPG")
    assert result == datetime(2024, 3, 15, 14, 32, 1)

def test_extract_dji_timestamp_invalid():
    result = extract_dji_timestamp("random_file.jpg")
    assert result == datetime.min

def test_extract_dji_timestamp_empty():
    result = extract_dji_timestamp("")
    assert result == datetime.min

def test_extract_dji_timestamp_short_parts():
    result = extract_dji_timestamp("DJI_12345.JPG")
    assert result == datetime.min


# ─── _normalize_filename ──────────────────────────────────────────────────────

def test_normalize_filename_standard():
    assert _normalize_filename("DJI_001.JPG") == "dji_001.jpg"

def test_normalize_filename_spaces():
    assert _normalize_filename("  DJI  001.JPG  ") == "dji001.jpg"

def test_normalize_filename_special_chars():
    assert _normalize_filename("foto (1).JPG") == "foto1.jpg"

def test_normalize_filename_case():
    assert _normalize_filename("PHOTO.JPEG") == "photo.jpeg"


# ─── normalize_column_names ───────────────────────────────────────────────────

def test_normalize_column_names_standard():
    df = pd.DataFrame(columns=["Blade SN", "Side", "Location", "Pixel MM", "Original Image"])
    result = normalize_column_names(df)
    assert result["blade"] == "Blade SN"
    assert result["region"] == "Side"
    assert result["z"] == "Location"
    assert result["pixel_mm"] == "Pixel MM"
    assert result["image"] == "Original Image"

def test_normalize_column_names_alternative():
    df = pd.DataFrame(columns=["blade_sn", "region", "distance_to_hub", "mm_px", "image_id"])
    result = normalize_column_names(df)
    assert result["blade"] == "blade_sn"
    assert result["region"] == "region"
    assert result["z"] == "distance_to_hub"
    assert result["pixel_mm"] == "mm_px"
    assert result["image"] == "image_id"
