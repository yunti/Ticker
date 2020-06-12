'use strict'

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
  const dom =
    element.type == 'TEXT_ELEMENT'
      ? document.createTextNode('')
      : document.createElement(element.type)

  const isProperty = (key) => key !== 'children'
  Object.keys(element.props)
    .filter(isProperty)
    .forEach((name) => {
      dom[name] = element.props[name]
    })

  element.props.children.forEach((child) => render(child, dom))
  container.appendChild(dom)
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

const element = (
  <div id="foo" style="background: salmon">
    <h1>Hello World</h1>
    <a href="">bar</a>
    <b></b>
  </div>
)

const container = document.getElementById('root')
// Ticker.render(element, container)
const node = document.createElement({
  type: 'h1',
  props: {
    children: 'Hello',
  },
})

const text = document.createTextNode('')
text['nodeValue'] = element.props.children
