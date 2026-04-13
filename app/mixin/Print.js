// =============================================================================
//  Print.js — Gerador de PDF via Electron (BrowserWindow + printToPDF)
//  Uso: Print.create().stringHTML('<h1>Olá mundo!</h1>').print()
//  Roda exclusivamente no main process do Electron
// =============================================================================
const { BrowserWindow } = require('electron')
const path = require('path')
const fs = require('fs')
const os = require('os')

class Print {
    constructor() {
        this._html = null
        this._destino = null
        this._opcoes = {
            marginsType: 0,
            pageSize: 'A4',
            printBackground: true,
            landscape: false
        }
    }
    // ---------------------------------------------------------------------------
    //  Factory — ponto de entrada da interface fluente
    //  Print.create()
    // ---------------------------------------------------------------------------
    static create() {
        return new Print()
    }
    // ---------------------------------------------------------------------------
    //  Define o conteúdo HTML que será convertido em PDF
    //  .stringHTML('<h1>Olá mundo!</h1>')
    // ---------------------------------------------------------------------------
    stringHTML(html) {
        if (typeof html !== 'string' || html.trim() === '') {
            throw new Error('Print.stringHTML: o conteúdo HTML não pode ser vazio.')
        }
        // Garante documento HTML completo para renderização correta no Chromium
        this._html = html.trim().startsWith('<!DOCTYPE') ? html : `
      <!DOCTYPE html>
      <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * { box-sizing: border-box; }
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          </style>
        </head>
        <body>${html}</body>
      </html>
    `
        return this
    }
    // ---------------------------------------------------------------------------
    //  Define o caminho de destino do arquivo PDF gerado
    //  .destino('/caminho/para/arquivo.pdf')
    //  Opcional: se omitido, salva em storage/pdfs/ com timestamp
    // ---------------------------------------------------------------------------
    destino(caminho) {
        this._destino = caminho
        return this
    }
    // ---------------------------------------------------------------------------
    //  Sobrescreve as opções padrão do printToPDF
    //  .opcoes({ pageSize: 'A4', landscape: true })
    // ---------------------------------------------------------------------------
    opcoes(config = {}) {
        this._opcoes = { ...this._opcoes, ...config }
        return this
    }
    // ---------------------------------------------------------------------------
    //  Gera o PDF — encerra a cadeia fluente
    //  .print() → Promise<{ sucesso: boolean, caminho: string }>
    // ---------------------------------------------------------------------------
    async print() {
        if (!this._html) {
            throw new Error('Print.print: defina o conteúdo com .stringHTML() antes de chamar .print().')
        }

        const caminhoPDF = this._resolverDestino()
        this._garantirDiretorio(caminhoPDF)

        const win = new BrowserWindow({
            show: false,
            width: 1024,
            height: 768,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true
            }
        })

        try {
            // Escreve o HTML em arquivo temporário — loadURL é mais estável que loadURL('data:')
            const arquivoTemp = path.join(os.tmpdir(), `print_${Date.now()}.html`)
            fs.writeFileSync(arquivoTemp, this._html, 'utf-8')

            await win.loadFile(arquivoTemp)

            // Pequena espera para garantir renderização completa de imagens e fontes
            await new Promise(resolve => setTimeout(resolve, 300))

            const pdfBuffer = await win.webContents.printToPDF(this._opcoes)

            fs.writeFileSync(caminhoPDF, pdfBuffer)

            // Remove o HTML temporário após a geração
            fs.unlinkSync(arquivoTemp)

            return { sucesso: true, caminho: caminhoPDF }

        } finally {
            // Garante que a janela oculta seja sempre destruída, mesmo em caso de erro
            if (!win.isDestroyed()) win.destroy()
        }
    }
    // ---------------------------------------------------------------------------
    //  Métodos privados
    // ---------------------------------------------------------------------------
    _resolverDestino() {
        if (this._destino) return this._destino

        // Destino padrão: storage/pdfs/<timestamp>.pdf relativo à raiz do projeto
        const pastaStorage = path.join(process.cwd(), 'storage', 'pdfs')
        return path.join(pastaStorage, `documento_${Date.now()}.pdf`)
    }
    _garantirDiretorio(caminhoPDF) {
        const pasta = path.dirname(caminhoPDF)
        if (!fs.existsSync(pasta)) {
            fs.mkdirSync(pasta, { recursive: true })
        }
    }
}

module.exports = Print