((template_content) @injection.content
  (#set! injection.language "html")
  (#set! injection.combined))
  
((template_content) @injection.content
  (#set! injection.language "markdown")
  (#set! injection.combined))

(javascript_statement
  (js_content) @injection.content
  (#set! injection.language "javascript")
  (#set! injection.combined))

(schema_statement
  (json_content) @injection.content
  (#set! injection.language "json")
  (#set! injection.combined))

(style_statement
  (style_content) @injection.content
  (#set! injection.language "css")
  (#set! injection.combined))

((comment) @injection.content
  (#set! injection.language "comment"))
