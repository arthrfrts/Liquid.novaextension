((template_content) @injection.content
        (#set! injection.language "json")
        (#set! injection.combined))

((json_content) @injection.content
        (#set! injection.language "json")
        (#set! injection.combined))

((front_matter) @injection.content
  (#set! injection.language "yaml"))
