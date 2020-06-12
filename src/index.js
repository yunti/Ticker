'use strict'

const element = (
  <div id="foo">
    <a href="">bar</a>
    <b></b>
  </div>
)

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === 'object' ? child : createTextElement(child),
      ),
    },
  }
}

function createTextElement(text) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: [],
    },
  }
}

function render(element, container) {
  // TODO create dom nodes
}

const Ticker = {
  createElement,
  render,
}

// const element = Ticker.createElement(
// 'div',
// { id: 'foot' },
// Ticker.createElement('a', null, 'bar'),
// Ticker.createElement('b'),
// )
const container = document.getElementById('root')
Ticker.render(element.container)
