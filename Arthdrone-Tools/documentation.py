# documentation.py - Função 6: Documentação bilíngue

from colorama import Fore, Style

from translations import t

def documentacao(lang="pt"):
    print(Fore.CYAN + f"\n=== {t('documentation_title', lang)} ===\n" + Style.RESET_ALL)

    doc_text = t("doc_text", lang)
    print(Fore.WHITE + doc_text + Style.RESET_ALL)

    input(t("enter_to_return", lang))