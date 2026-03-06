# colorama_config.py - Paleta de cores baseada em Pantone 18-4051 TCX (Classic Blue)

try:
    from colorama import Fore, Back, Style, init
    init(autoreset=True)
except ImportError:
    class Dummy:
        def __getattr__(self, _): return ""
    Fore = Back = Style = Dummy()

# Paleta inspirada em Classic Blue (#0F4C81)
COLORS = {
    "title": Fore.BLUE + Style.BRIGHT,          # Títulos e bordas principais (Pantone-like)
    "highlight": Fore.CYAN + Style.BRIGHT,      # Opções do menu e informações importantes
    "success": Fore.BLUE + Style.BRIGHT,        # Saídas de sucesso (ex: "gerado com sucesso")
    "warning": Fore.MAGENTA,                    # Avisos e neutros (tom frio relacionado ao azul)
    "error": Fore.RED + Style.BRIGHT,           # Erros críticos
    "info": Fore.WHITE,                         # Texto normal / secundário
    "prompt": Fore.CYAN,                        # Prompts de input
    "border": Fore.BLUE,                        # Linhas separadoras
}

def c(key):
    """Retorna a cor correspondente ou vazio se colorama não estiver disponível"""
    return COLORS.get(key, "")

def print_title(text):
    print(c("border") + "=" * 60 + Style.RESET_ALL)
    print(c("title") + f"          {text}" + Style.RESET_ALL)
    print(c("border") + "=" * 60 + Style.RESET_ALL)

def print_option(text):
    print(c("highlight") + text + Style.RESET_ALL)

def print_success(text):
    print(c("success") + text + Style.RESET_ALL)

def print_warning(text):
    print(c("warning") + text + Style.RESET_ALL)

def print_error(text):
    print(c("error") + text + Style.RESET_ALL)

def print_info(text):
    print(c("info") + text + Style.RESET_ALL)

def print_prompt(text):
    print(c("prompt") + text + Style.RESET_ALL, end="")