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
  // Create DOM Element
  const dom =
    element.type == 'TEXT_ELEMENT'
      ? document.createTextNode('')
      : document.createElement(element.type)

  // Add Event Listeners
  const isEvent = (key) => key.startsWith('on')
  Object.keys(element.props)
    .filter(isEvent)
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2)
      dom.addEventListener(eventType, element.props[name])
    })

  // Set properties on DOM Element
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

/** @jsx Ticker.createElement */
const element = (
  <div id="foo" style="background: salmon">
    <h1 name="Bob">{`Hello ${name}`}</h1>
    <button style="background: green" onClick={() => console.log('Clicked')}>
      Press
    </button>
    <b></b>
  </div>
)

const container = document.getElementById('root')
Ticker.render(element, container)
