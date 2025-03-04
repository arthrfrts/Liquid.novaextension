; Consulta para identificar o contexto de completions
; Estes facilitam o mapeamento entre a árvore Tree-sitter e os providers de completions

; Contexto de tag Liquid
(tag_statement) @liquid.tag
(tag_start) @liquid.tag.start
(tag_end) @liquid.tag.end

; Contexto de tag de fechamento
(tag_statement
  (tag_start
    "{% "
    "end" @liquid.tag.end-prefix
    (identifier) @liquid.tag.end-name)) @liquid.tag.end

; Contexto de variáveis/output Liquid
(output_statement) @liquid.output
(output_start) @liquid.output.start
(output_end) @liquid.output.end

; Contexto de filtros
(filter
  "|" @liquid.filter.operator
  (identifier) @liquid.filter.name) @liquid.filter

; Contexto de argumentos de filtros
(filter
  (identifier) @liquid.filter.name
  ":" @liquid.filter.args.separator
  (_) @liquid.filter.args.value) @liquid.filter.args

; Contexto de parâmetros de tags
(tag_statement
  (tag_start
    "{% "
    (identifier) @liquid.tag.name) @liquid.tag.params.start) @liquid.tag.params

; Contexto para condicionais
(if_expression
  (operator) @liquid.conditional.operator) @liquid.conditional

; Contexto para loops
(for_expression
  "in" @liquid.loop.in-keyword
  (_) @liquid.loop.collection) @liquid.loop

; Contexto para identificar nós em documentos HTML
(template_content) @liquid.html

; Contexto para identificar nós em documentos Markdown
(json_content) @liquid.markdown
