((comment) @comment @spell
  (#set! priority 110))

(raw_statement
  (raw_content) @spell
  (#set! priority 110))

((identifier) @identifier
  (#set! priority 110))

(access
receiver: (identifier) @identifier
  property: (identifier) @identifier.property
  (#set! priority 120)
)

((string) @string
  (#set! priority 110))

((boolean) @value.boolean
  (#set! priority 110))

((number) @value.number
  (#set! priority 110))

(filter
  name: (identifier) @identifier.function
  (#set! priority 110))
  
([
  "echo"
  "endcapture"
  "endform"
  "endjavascript"
  "endraw"
  "endschema"
  "endstyle"
  "form"
  "include"
  "javascript"
  "layout"
  "liquid"
  "raw"
  "schema"
  "style"
  (break_statement)
  (continue_statement)
  "by"
  "cycle"
  "endfor"
  "endpaginate"
  "endtablerow"
  "for"
  "paginate"
  "tablerow"
] @keyword
  (#set! priority 110))

([
  "as"
  "assign"
  "decrement"
  "increment"
  "with"
  "capture"
  "endcapture"
  ; "include"
] @keyword.construct
  (#set! priority 110))

([
  "case"
  "else"
  "elsif"
  "endcase"
  "endif"
  "endunless"
  "if"
  "unless"
  "when"
] @keyword.conditional
  (#set! priority 110))

([
  "and"
  "contains"
  "in"
  "or"
] @keyword.modifier
  (#set! priority 110))

([
  "{{"
  "}}"
  "{{-"
  "-}}"
  "{%"
  "%}"
  "{%-"
  "-%}"
] @tag.framework
  (#set! priority 110))

[
  "include"
  "render"
  "section"
  "sections"
] @keyword.self

[
  "|"
  ":"
  "="
  "+"
  "-"
  "*"
  "/"
  "%"
  "^"
  "=="
  "<"
  "<="
  "!="
  ">="
  ">"
] @operator

[
  "]"
  "["
  ")"
  "("
] @bracket

[
  ","
  "."
] @comma

[
  (identifier) @tag.framework (#match? @keyword ".*")
]

; ;; Match custom Liquid variables (e.g., {{ custom_var1 }})
; [
;   (variable_name) @variable (#match? @variable "custom_var1|custom_var2")
; ]
