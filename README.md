# bm-cli

**Prosty menedżer zakładek w terminalu.** Jedna plikowa baza (JSON) w katalogu domowym, komendy: dodawanie, listowanie, wyszukiwanie, otwieranie w przeglądarce, eksport do HTML. Bez zewnętrznych serwisów — wszystko lokalnie.

- **Czego dotyczy:** Przechowywanie i szybki dostęp do ulubionych linków z CLI (add, list, search, open, rm, export-html). Przydatne gdy wolisz terminal niż zakładki w przeglądarce lub chcesz backup w jednym pliku.
- **Co dokładnie robi:** Zapisuje zakładki w `~/.bm-bookmarks.json`. Komenda `add` dodaje URL z opcjonalnym tytułem i tagami; `list` i `search` wypisują wyniki; `open <id>` otwiera link w domyślnej przeglądarce; `export-html` generuje plik HTML z listą linków.
- **Open source:** MIT, autor: **yuw**.

---

## Wymagania

Node.js 18+

## Instalacja

```bash
git clone https://github.com/yuwxd/bm-cli.git
cd bm-cli
npm link
```

(lub uruchamiaj przez `node cli.js` bez linkowania)

## Użycie krok po kroku

1. **Dodaj zakładkę:**  
   `bm add https://example.com "Example"`

2. **Dodaj z tagami:**  
   `bm add https://github.com yuw --tag dev --tag code`

3. **Pokaż wszystkie:**  
   `bm list`

4. **Lista tylko z danym tagiem:**  
   `bm list --tag dev`

5. **Szukaj po tekście (url / tytuł / tag):**  
   `bm search github`

6. **Otwórz w przeglądarce (po ID z listy):**  
   `bm open 1`

7. **Usuń zakładkę:**  
   `bm rm 1`

8. **Eksport do HTML:**  
   `bm export-html`  
   `bm export-html my-links.html`

9. **Gdzie jest plik z zakładkami:**  
   `bm path`  
   Domyślnie: `~/.bm-bookmarks.json`. Możesz ustawić `BM_PATH` w środowisku.

## Publikacja na GitHub

Repozytorium: `yuwxd/bm-cli`. Po utworzeniu pustego repo na GitHubie:

```bash
cd bm-cli
git remote add origin https://github.com/yuwxd/bm-cli.git
git push -u origin main
```

CI (testy) uruchamia się przy każdym pushu na `main`.

## Licencja

MIT. Autor: **yuw**.
