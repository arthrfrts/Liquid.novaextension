---
title: "Liquid in HTML"
date: 2024-07-30
---

# Example of Markdown with Liquid

This is an example of how to use Liquid code in a markdown file.

<style>
	.header {
	  background-color: #fff;
	  color: {{ site.header_text_color }};
	  padding: 10px 0;
	  text-align: center;
	}
	
	.header h1 {
	  margin: 0;
	  font-size: 2rem;
	}
	
	.content {
	  padding: 20px;
	  background-color: {{ site.content_background_color }};
	}
</style>

## Variables

You can define variables in Liquid and use them in your content:

{% assign name = "User" %}
Hello, {{ name }}!

## Loops

You can use loops to iterate over lists of items:

{% assign fruits = "Apple,Orange,Banana,Grape" | split: "," %}
<ul>
{% for fruit in fruits %}
  <li>{{ fruit }}</li>
{% endfor %}
</ul>

## Conditionals

You can use conditionals to render content based on certain conditions:

{% assign age = 25 %}
{% if age >= 18 %}
  <p>You are an adult.</p>
{% else %}
  <p>You are a minor.</p>
{% endif %}

## Filters

You can use filters to format variables:

{% assign price = 19.99 %}
The price is {{ price | format: "%.2f" }}.

## Includes

You can include other Liquid files:

{% include 'header.html' %}

## Capturing

You can capture the output of Liquid into a variable:

{% capture greeting %}
  Hello, {{ name }}!
{% endcapture %}

{{ greeting }}

## Comments

You can add comments that will not be rendered:

{%- comment -%}
  This is a comment in Liquid.
{%- endcomment -%}
