
build: templates components
	@component build --dev

templates:
	@component convert template.html


components: component.json
	@component install --dev

clean:
	rm -fr build components

.PHONY: clean
