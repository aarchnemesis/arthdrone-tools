from cx_Freeze import setup, Executable

setup(
    name="ArthdroneTools",
    version="1.0",
    description="Ferramenta de S&R para inspeção de pás eólicas",
    executables=[Executable(
        "main.py",
        base="Console",  # janela preta visível para input/arrastar
        icon="icone.ico"  # ← aqui o ícone
    )],
    options={
        "build_exe": {
            "packages": ["pandas", "openpyxl", "PIL", "colorama"],
            "include_files": [
                "translations.py",
                "utils.py",
                "organize_images.py",
                "convert_csv.py",
                "extract_gps_z.py",
                "process_json.py",
                "organize_json_photos.py",
                "documentation.py",
                "icone.ico"  # inclui o ícone no build
            ],
            "excludes": ["tkinter", "matplotlib", "scipy", "numpy.testing"],
            "include_msvcr": True,
            "optimize": 2
        }
    }
)