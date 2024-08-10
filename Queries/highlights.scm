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
 (#set! priority 101))


([
  "]"
  "["
  ")"
  "("
  ] @bracket
 (#set! priority 101))

([
  ","
  "."
  ] @comma
 (#set! priority 101))


([
  (break_statement)
  "by"
  "case"
  (continue_statement)
  (custom_unpaired_statement)
  "cycle"
  "decrement"
  "echo"
  "else"
  "elsif"
  "endcase"
  "endfor"
  "endform"
  "endif"
  "endjavascript"
  "endpaginate"
  "endraw"
  "endschema"
  "endstyle"
  "endtablerow"
  "endunless"
  "for"
  "form"
  "if"
  "increment"
  "javascript"
  "layout"
  "liquid"
  "paginate"
  "raw"
  "schema"
  "section"
  "sections"
  "style"
  "tablerow"
  "unless"
  "when"
  "with"
  ] @keyword
 (#set! priority 101))
 
 ([
	 "assign"
	 "capture"
	 "endcapture"
	 "include"
	 "render"
	 ] @keyword.construct
	(#set! priority 101))

([
  "and"
  "contains"
  "or"
  ] @keyword.operator
 (#set! priority 101))
 
([
	 "as"
	 "in"
	 ] @keyword.modifier
	(#set! priority 101))

([
  "|"
  ":"
  "="
  (predicate)
  ] @operator
 (#set! priority 101))

((identifier) @identifier (#set! priority 101))
((string) @string (#set! priority 101))
((boolean) @value.boolean (#set! priority 101))
((number) @value.number (#set! priority 101))

(access
	receiver: (identifier) @identifier
	property: (identifier) @identifier.property
	(#set! priority 120)
)

(filter
  name: (identifier) @identifier.function (#set! priority 101))

(raw_statement
  (raw_content) @keyword.self (#set! priority 102))

((comment) @comment (#set! priority 102))
