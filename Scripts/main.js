/**
 * Manages completions and Tree-sitter integration
 */

const AutoPairingHelper = require('./auto-pairing');

class LiquidCompletionAssistant {
  constructor() {
    // Initializing props
    this.syntaxes = ["liquid", "liquid-html", "liquid-md"];
    this.loadedQueries = {};

    // Loads queries to use with completions.
    this.loadQueries();
  }

  /**
   * Loads Tree-sitter queries to be used with Completions.
   */
  loadQueries() {
    try {
      // Loading queries file
      const queryFile = nova.extension.path("Queries/completions.scm");
      const queryContent = nova.fs.open(queryFile, "r").read();

      this.completionsQuery = queryContent;
      console.log("Tree-sitter queries loaded successfully.");
    } catch (error) {
      console.error("Error while loading Tree-sitter queries:", error);
    }
  }

  /**
   * Provides completions to a specific position in the document.
   * @param {Editor} editor - active editor
   * @param {CompletionContext} context - completion context
   * @returns {CompletionItem[]} completion item list
   */
  provideCompletions(editor, context) {
    try {
      // Checks document type
      const syntax = editor.document.syntax;
      if (!this.syntaxes.includes(syntax)) {
        return [];
      }

      // Checks if we're in a Liquid block
      const isInLiquidBlock = this.isPositionInLiquidBlock(editor, context.position);
      if (!isInLiquidBlock) {
        return null;
      }

      // Check if the last character typed causes auto-pairing
      const isAutoPairing = AutoPairingHelper.isLastCharAutoPaired(editor, context.position, {
        pairingChars: ['{', '%', '|']
      });

      // If auto-pairing is occurring, set a flag for use in behaviors
      if (isAutoPairing) {
        nova.workspace.context.set('liquid.autoPairing', true);
      }

      // Check if there are closing characters after the cursor
      const hasClosingBrace = AutoPairingHelper.hasClosingCharAfterCursor(editor, context.position, '}');
      const hasClosingPercent = AutoPairingHelper.hasClosingCharAfterCursor(editor, context.position, '%');

      if (hasClosingBrace || hasClosingPercent) {
        nova.workspace.context.set('liquid.hasClosingChar', true);
      }

      // Analyze the current context
      const currentContext = this.getCurrentContext(editor, context.position);
      console.log("Contexto atual:", currentContext);

      // Retornar items de completion com base no contexto
      return this.getCompletionsForContext(currentContext);
    } catch (error) {
      console.error("Error providing completions:", error);
      return [];
    }
  }

  /**
   * Checks if the current position is inside a Liquid block
   * @param {Editor} editor - active editor
   * @param {Number} position - cursor position
   * @returns {Boolean} true if inside a Liquid block
   */
  isPositionInLiquidBlock(editor, position) {
    try {
      // Gets the current Tree-sitter node
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
      console.error("Error checking position in Liquid block:", error);
      return false;
    }
  }

  /**
   * Determines the current completion context
   * @param {Editor} editor - active editor
   * @param {Number} position - cursor position
   * @returns {Object} Information about the current context
   */
  getCurrentContext(editor, position) {
    try {
      // Gets the current Tree-sitter node
      const node = editor.getTreeSitterNodeAtPosition(position);
      if (!node) return { type: "unknown" };

      // Gets the text of the current line
      const line = editor.getTextInRange(new Range(
        editor.getLineRangeForPosition(position).start,
        editor.getLineRangeForPosition(position).end
      ));

      // Text before cursor
      const textBeforeCursor = line.substring(0, position -
        editor.getLineRangeForPosition(position).start
      );

      // Determine the context based on the node and text
      const nodeType = node.type;

      // Tag context
      if (nodeType === "tag_start" || textBeforeCursor.trimRight().endsWith("{%")) {
        return { type: "tag_start" };
      }

      // Closing tag context
      if (textBeforeCursor.match(/{%\s*end\w*$/)) {
        return { type: "tag_end" };
      }

      // Output context
      if (nodeType === "output_start" || textBeforeCursor.trimRight().endsWith("{{")) {
        return { type: "output_start" };
      }

      // Filter context
      if (nodeType === "filter" || textBeforeCursor.trimRight().endsWith("|")) {
        return { type: "filter" };
      }

      // Filter arguments context
      if (textBeforeCursor.match(/\|\s*[\w_]+:?\s*$/)) {
        const filterMatch = textBeforeCursor.match(/\|\s*([\w_]+)/);
        const filterName = filterMatch ? filterMatch[1] : "";
        return { type: "filter_args", filterName };
      }

      // Tag parameters context
      const tagMatch = textBeforeCursor.match(/{%\s*([\w_]+)/);
      if (tagMatch) {
        return { type: "tag_params", tagName: tagMatch[1] };
      }

      // Contexto genérico Liquid
      return { type: "liquid" };
    } catch (error) {
      console.error("Error determining context:", error);
      return { type: "unknown" };
    }
  }

  /**
   * Generates completion items for the provided context
   * @param {Object} context - Determined context
   * @returns {CompletionItem[]} List of completion items
   */
  getCompletionsForContext(context) {
    // Implement logic to generate completions based on context
    // Since we have XML files for this, we return null to use declarative providers
    return null;
  }
}

exports.activate = function() {
  const assistant = new LiquidCompletionAssistant();
  ["liquid", "liquid-html", "liquid-md"].forEach(syntax => {
    nova.assistants.registerCompletionAssistant(syntax, assistant);
  });
  console.log("Liquid Extension enabled with Tree-sitter support");
};

exports.deactivate = function() {
  // Blank for a while
};
