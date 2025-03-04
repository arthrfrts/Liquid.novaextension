/**
 * Script principal para a extensão Liquid
 * Gerencia o carregamento de completions e integração com Tree-sitter
 */

const AutoPairingHelper = require('./auto-pairing');

class LiquidCompletionAssistant {
  constructor() {
    // Inicialização das propriedades
    this.syntaxes = ["liquid", "liquid-html", "liquid-md"];
    this.loadedQueries = {};

    // Carregar a consulta para completions
    this.loadQueries();
  }

  /**
   * Carrega as consultas Tree-sitter para uso nas completions
   */
  loadQueries() {
    try {
      // Carregar arquivo de consultas
      const queryFile = nova.extension.path("Queries/completions.scm");
      const queryContent = nova.fs.open(queryFile, "r").read();

      this.completionsQuery = queryContent;
      console.log("Consultas Tree-sitter carregadas com sucesso");
    } catch (error) {
      console.error("Erro ao carregar consultas Tree-sitter:", error);
    }
  }

  /**
   * Fornece completions para uma posição específica no documento
   * @param {Editor} editor - O editor ativo
   * @param {CompletionContext} context - Contexto da completion
   * @returns {CompletionItem[]} Lista de items de completion
   */
  provideCompletions(editor, context) {
    try {
      // Verificar o tipo de documento
      const syntax = editor.document.syntax;
      if (!this.syntaxes.includes(syntax)) {
        return [];
      }

      // Verificar se estamos dentro de um bloco Liquid
      const isInLiquidBlock = this.isPositionInLiquidBlock(editor, context.position);
      if (!isInLiquidBlock) {
        // Delegar para o provedor padrão se não estivermos em um bloco Liquid
        return null;
      }

      // Verificar se o último caractere digitado é um que causa auto-pairing
      const isAutoPairing = AutoPairingHelper.isLastCharAutoPaired(editor, context.position, {
        pairingChars: ['{', '%', '|']
      });

      // Se está ocorrendo auto-pairing, definir um flag para uso nos behaviors
      if (isAutoPairing) {
        nova.workspace.context.set('liquid.autoPairing', true);
      }

      // Verificar se há caracteres de fechamento após o cursor
      const hasClosingBrace = AutoPairingHelper.hasClosingCharAfterCursor(editor, context.position, '}');
      const hasClosingPercent = AutoPairingHelper.hasClosingCharAfterCursor(editor, context.position, '%');

      if (hasClosingBrace || hasClosingPercent) {
        nova.workspace.context.set('liquid.hasClosingChar', true);
      }

      // Analisar o contexto atual
      const currentContext = this.getCurrentContext(editor, context.position);
      console.log("Contexto atual:", currentContext);

      // Retornar items de completion com base no contexto
      return this.getCompletionsForContext(currentContext);
    } catch (error) {
      console.error("Erro ao fornecer completions:", error);
      return [];
    }
  }

  /**
   * Verifica se a posição atual está dentro de um bloco Liquid
   * @param {Editor} editor - O editor ativo
   * @param {Number} position - Posição do cursor
   * @returns {Boolean} true se estiver dentro de um bloco Liquid
   */
  isPositionInLiquidBlock(editor, position) {
    try {
      // Obter o nó Tree-sitter atual
      const node = editor.getTreeSitterNodeAtPosition(position);
      if (!node) return false;

      // Verificar se o nó ou algum ancestral é um nó Liquid
      let current = node;
      while (current) {
        const type = current.type;
        if (
          type.includes("tag") ||
          type.includes("output") ||
          type === "variable" ||
          type === "filter"
        ) {
          return true;
        }
        current = current.parent;
      }

      // Verificar o texto ao redor para completions que ainda não têm nós
      const line = editor.getTextInRange(new Range(
        editor.getLineRangeForPosition(position).start,
        editor.getLineRangeForPosition(position).end
      ));

      // Verificar se estamos após '{{' ou '{%'
      const textBeforeCursor = line.substring(0, position -
        editor.getLineRangeForPosition(position).start
      );

      return textBeforeCursor.trimRight().endsWith("{{") ||
             textBeforeCursor.trimRight().endsWith("{%");
    } catch (error) {
      console.error("Erro ao verificar posição em bloco Liquid:", error);
      return false;
    }
  }

  /**
   * Determina o contexto de completion atual
   * @param {Editor} editor - O editor ativo
   * @param {Number} position - Posição do cursor
   * @returns {Object} Informações sobre o contexto atual
   */
  getCurrentContext(editor, position) {
    try {
      // Obter o nó Tree-sitter atual
      const node = editor.getTreeSitterNodeAtPosition(position);
      if (!node) return { type: "unknown" };

      // Obter o texto da linha atual
      const line = editor.getTextInRange(new Range(
        editor.getLineRangeForPosition(position).start,
        editor.getLineRangeForPosition(position).end
      ));

      // Texto antes do cursor
      const textBeforeCursor = line.substring(0, position -
        editor.getLineRangeForPosition(position).start
      );

      // Determinar o contexto com base no nó e no texto
      const nodeType = node.type;

      // Contexto de tag
      if (nodeType === "tag_start" || textBeforeCursor.trimRight().endsWith("{%")) {
        return { type: "tag_start" };
      }

      // Contexto de tag de fechamento
      if (textBeforeCursor.match(/{%\s*end\w*$/)) {
        return { type: "tag_end" };
      }

      // Contexto de output
      if (nodeType === "output_start" || textBeforeCursor.trimRight().endsWith("{{")) {
        return { type: "output_start" };
      }

      // Contexto de filtro
      if (nodeType === "filter" || textBeforeCursor.trimRight().endsWith("|")) {
        return { type: "filter" };
      }

      // Contexto de argumentos de filtro
      if (textBeforeCursor.match(/\|\s*[\w_]+:?\s*$/)) {
        const filterMatch = textBeforeCursor.match(/\|\s*([\w_]+)/);
        const filterName = filterMatch ? filterMatch[1] : "";
        return { type: "filter_args", filterName };
      }

      // Contexto de parâmetros de tag
      const tagMatch = textBeforeCursor.match(/{%\s*([\w_]+)/);
      if (tagMatch) {
        return { type: "tag_params", tagName: tagMatch[1] };
      }

      // Contexto genérico Liquid
      return { type: "liquid" };
    } catch (error) {
      console.error("Erro ao determinar contexto:", error);
      return { type: "unknown" };
    }
  }

  /**
   * Gera items de completion para o contexto fornecido
   * @param {Object} context - Contexto determinado
   * @returns {CompletionItem[]} Lista de items de completion
   */
  getCompletionsForContext(context) {
    // Implementar lógica para gerar completions com base no contexto
    // Como temos arquivos XML para isso, retornamos null para usar os providers declarativos
    return null;
  }
}

// Iniciar a extensão
exports.activate = function() {
  // Registrar os providers declarativos via XML
  // Os arquivos XML serão descobertos automaticamente na pasta Completions/

  // Adicionar o assistente programático se necessário
  const assistant = new LiquidCompletionAssistant();

  // Registrar para todas as sintaxes suportadas
  ["liquid", "liquid-html", "liquid-md"].forEach(syntax => {
    nova.assistants.registerCompletionAssistant(syntax, assistant);
  });

  // Log de depuração
  console.log("Extensão Liquid ativada com suporte a completions Tree-sitter");
};

// Desativar a extensão
exports.deactivate = function() {
  // Código de limpeza, se necessário
};
