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
/** @jsx Ticker.createElement */
const element = <h1 title="foo">Hello World</h1>

/** @jsx Ticker.createElement */
// const element = (
//   <div id="foo" style="background: salmon">
//     <h1>Hello World</h1>
//     <a href="">bar</a>
//     <b></b>
//   </div>
// )
const container = document.getElementById('root')

// const node = document.createElement(element.type)
// node['title'] = element.props.title

// const text = document.createTextNode('')
// text['nodeValue'] = element.props.children[0].props.nodeValue

// node.appendChild(text)
// container.appendChild(node)
Ticker.render(element, container)
