# utils.py - Funções utilitárias comuns para todo o projeto

from pathlib import Path
import re
import pandas as pd
from PIL import Image
from PIL.ExifTags import TAGS, GPSTAGS, IFD
from datetime import datetime

SUPPORTED_EXTS = {".JPG", ".JPEG"}

def get_path_from_input(prompt: str) -> Path | None:
    print(prompt)
    raw = input("> ").strip()
    raw = raw.strip('"').strip("'")
    path = Path(raw)
    if not path.exists():
        print(f"❌ Caminho não encontrado: {raw}")
        return None
    return path

def find_image(image_path: str, image_cache: dict) -> Path | None:
    name_lower = Path(image_path).name.lower().strip()
    return image_cache.get(name_lower)

def format_mm_px(value: float) -> str:
    try:
        return f"{value:.5f}".replace(".", "_")
    except (ValueError, TypeError):
        return "UNKNOWN"

def format_location_for_name(value) -> int:
    try:
        return int(float(value))
    except (ValueError, TypeError):
        return -1

def normalize_column_names(df: pd.DataFrame) -> dict:
    lower_cols = {c.lower().replace(" ", "").replace("_", ""): c for c in df.columns}
    col_map = {}

    mappings = {
        'blade': ['bladesn', 'blade sn', 'blade'],
        'region': ['side', 'region'],
        'z': ['location', 'distance_to_hub', 'z'],
        'pixel_mm': ['pixelmm', 'pixel mm', 'mm_px', 'pixelsize'],
        'image': ['originalimage', 'original image', 'image_id', 'originalfilename']
    }

    for target, possibles in mappings.items():
        for possible in possibles:
            key = possible.lower().replace(" ", "").replace("_", "")
            if key in lower_cols:
                col_map[target] = lower_cols[key]
                break
    return col_map

def extract_dji_timestamp(filename: str):
    try:
        parts = filename.split('_')
        if len(parts) >= 2 and len(parts[1]) == 14:
            return datetime.strptime(parts[1], "%Y%m%d%H%M%S")
    except (ValueError, IndexError):
        pass
    return datetime.min

def get_exif_field(exif_data, field_name):
    if not exif_data:
        return None
    for tag_id, value in exif_data.items():
        tag = TAGS.get(tag_id, tag_id)
        if tag == field_name:
            return value
    gps_info = exif_data.get(34853)
    if gps_info:
        for tag_id, value in gps_info.items():
            tag = GPSTAGS.get(tag_id, tag_id)
            if tag == field_name:
                return value
    return None

def extract_gps_altitude(image_path: Path):
    try:
        with Image.open(image_path) as img:
            exif = img.getexif()
            if not exif:
                return None

            # Usa a API pública get_ifd() para acessar o bloco GPS
            gps_ifd = exif.get_ifd(IFD.GPSInfo)
            if not gps_ifd:
                return None

            # GPSAltitude é tag 6 no IFD GPS
            altitude = gps_ifd.get(6)  # GPSAltitude
            if altitude is None:
                return None

            # Converter para float independente do tipo retornado pelo Pillow
            # (pode ser tuple, Fraction, IFDRational ou float dependendo da versão)
            if hasattr(altitude, 'numerator'):
                altitude = float(altitude)
            elif isinstance(altitude, tuple):
                altitude = altitude[0] / altitude[1]
            else:
                altitude = float(altitude)

            # GPSAltitudeRef é tag 5: 0 = acima do nível do mar, 1 = abaixo
            ref = gps_ifd.get(5)  # GPSAltitudeRef
            if ref == 1:
                altitude = -altitude

            return round(float(altitude), 3)
    except Exception as e:
        print(f"Erro ao ler GPS de {image_path.name}: {e}")
        return None