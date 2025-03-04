/**
 * Helper class for auto-pairing detection.
 */
class AutoPairingHelper {
  /**
   * Checks if there's a closing bracket after the user cursor.
   *
   * @param {Editor} editor - active editor
   * @param {Number} position - cursor position
   * @param {String} closeChar - closing character to look for
   * @returns {Boolean} true if closeChar is already present
   */
  static hasClosingCharAfterCursor(editor, position, closeChar) {
    try {
      // Gets the current line
      const lineRange = editor.getLineRangeForPosition(position);
      const line = editor.getTextInRange(lineRange);

      // Gets the cursor relative position in the line.
      const cursorOffset = position - lineRange.start;

      // Checks the character after the cursor.
      if (cursorOffset < line.length) {
        // If the cursor isn't at the end of the line, check the next character.
        return line[cursorOffset] === closeChar;
      }

      return false;
    } catch (error) {
      console.error('Error while trying to check the closing character:', error);
      return false;
    }
  }

  /**
   * Checks if there's a sequence of closing characters after the cursor.
   *
   * @param {Editor} editor - active editor
   * @param {Number} position - cursor position
   * @param {String} closeSequence - closing character sequence to look for (like %})
   * @returns {Boolean} true if the closing sequence is there
   */
  static hasClosingSequenceAfterCursor(editor, position, closeSequence) {
    try {
      // Gets the current line
      const lineRange = editor.getLineRangeForPosition(position);
      const line = editor.getTextInRange(lineRange);

      // Gets the cursor relative position in the line.
      const cursorOffset = position - lineRange.start;

      // Checks if there's enough characters after the cursor.
      if (cursorOffset + closeSequence.length <= line.length) {
        // Get the next characters after the cursor.
        const nextChars = line.substring(cursorOffset, cursorOffset + closeSequence.length);
        return nextChars === closeSequence;
      }

      return false;
    } catch (error) {
      console.error('Error while trying to check the closing character sequence:', error);
      return false;
    }
  }

  /**
   * Checks if the text being typed has auto-pairing characters.
   *
   * @param {String} text - typed text
   * @returns {Object} Which kinds of auto-pairing are needed.
   */
  static detectAutoPairingNeeds(text) {
    const result = {
      needsLiquidTagClosing: false,  // needs %}
      needsLiquidOutputClosing: false, // needs }}
      hasOpenLiquidTag: false,      // has {%
      hasOpenLiquidOutput: false    // has {{
    };

    // Detecting Liquid tags
    if (text.includes('{%') && !text.includes('%}')) {
      result.needsLiquidTagClosing = true;
      result.hasOpenLiquidTag = true;
    } else if (text.includes('{%')) {
      result.hasOpenLiquidTag = true;
    }

    // Detecting Liquid outputs
    if (text.includes('{{') && !text.includes('}}')) {
      result.needsLiquidOutputClosing = true;
      result.hasOpenLiquidOutput = true;
    } else if (text.includes('{{')) {
      result.hasOpenLiquidOutput = true;
    }

    return result;
  }

  /**
   * Checks if the cursor is in a specific Liquid block in the current line.
   *
   * @param {Editor} editor - active editor
   * @param {Number} position - cursor position
   * @returns {Object} Cursor context information.
   */
  static getLiquidContextInCurrentLine(editor, position) {
    try {
      // Gets the current line.
      const lineRange = editor.getLineRangeForPosition(position);
      const line = editor.getTextInRange(lineRange);

      // Cursor relative position in the line.
      const cursorOffset = position - lineRange.start;

      // Default context
      const context = {
        inLiquidTag: false,
        inLiquidOutput: false,
        tagStart: -1,
        tagEnd: -1,
        outputStart: -1,
        outputEnd: -1,
        hasClosingTag: false,
        hasClosingOutput: false
      };

      // Looks for tag occurrences in the line.
      let tagStartIndex = 0;
      while ((tagStartIndex = line.indexOf('{%', tagStartIndex)) !== -1) {
        const tagEndIndex = line.indexOf('%}', tagStartIndex + 2);

        // If it finds a complete pair
        if (tagEndIndex !== -1) {
          // Checks if the cursor is between them
          if (cursorOffset > tagStartIndex && cursorOffset <= tagEndIndex + 2) {
            context.inLiquidTag = true;
            context.tagStart = tagStartIndex;
            context.tagEnd = tagEndIndex + 2;
            context.hasClosingTag = true;
            break;
          }
        }
        // If it only found an opening
        else if (cursorOffset > tagStartIndex) {
          context.inLiquidTag = true;
          context.tagStart = tagStartIndex;
          context.hasClosingTag = false;
          break;
        }

        tagStartIndex += 2;
      }

      // Looking for all output occurences in the line.
      let outputStartIndex = 0;
      while ((outputStartIndex = line.indexOf('{{', outputStartIndex)) !== -1) {
        const outputEndIndex = line.indexOf('}}', outputStartIndex + 2);

        // If it finds a complete pair.
        if (outputEndIndex !== -1) {
          // Checks if the cursor is between the pair.
          if (cursorOffset > outputStartIndex && cursorOffset <= outputEndIndex + 2) {
            context.inLiquidOutput = true;
            context.outputStart = outputStartIndex;
            context.outputEnd = outputEndIndex + 2;
            context.hasClosingOutput = true;
            break;
          }
        }
        // If it only found an opening.
        else if (cursorOffset > outputStartIndex) {
          context.inLiquidOutput = true;
          context.outputStart = outputStartIndex;
          context.hasClosingOutput = false;
          break;
        }

        outputStartIndex += 2;
      }

      return context;
    } catch (error) {
      console.error('Error while trying to check the current Liquid context:', error);
      return {
        inLiquidTag: false,
        inLiquidOutput: false
      };
    }
  }
}
