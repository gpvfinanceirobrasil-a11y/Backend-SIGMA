# SIGMA Backend Apps Script

Backend/API do SIGMA usando Google Apps Script e Google Sheets.

## Stack

- Google Apps Script
- Google Sheets

## Publicação

1. Criar projeto Apps Script vinculado ao Google Sheets.
2. Criar os arquivos `.gs` conforme este repositório.
3. Rodar `setup`.
4. Publicar como App da Web.
5. Permissão: Qualquer pessoa.

## Endpoints

GET:

```text
?action=status
?action=setup
?action=getDashboard
?action=getMGR
```

POST:

```json
{ "action": "processarSigma" }
```

```json
{ "action": "uploadReceitas", "rows": [] }
```

```json
{ "action": "uploadDespesas", "rows": [] }
```

```json
{ "action": "uploadRateios", "rows": [] }
```

## Versão

v0.1.0 - Fundação inicial.
