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

let rootInstance = null

function render(element, container) {
  const prevInstance = rootInstance
  const nextInstance = reconcile(container, prevInstance, element)
  rootInstance = nextInstance
}

function reconcile(parentDom, instance, element) {
  if (instance == null) {
    const newInstance = instantiate(element)
    parentDom.appendChild(newInstance.dom)
    return newInstance
  } else {
    const newInstance = instantiate(element)
    parentDom.replaceChild(newInstance.dom, instance.dom)
    return newInstance
  }
}

function instantiate(element, parentDom) {
  // Create DOM Element
  const dom =
    element.type === 'TEXT_ELEMENT'
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

  const childElements = element.props.children || []
  const childInstances = childElements.map(instantiate)
  const childDoms = childInstances.map((childInstance) => childInstance.dom)
  childDoms.forEach((childDom) => dom.appendChild(childDom))

  const instance = { dom, element, childInstances }
  return instance
}

const Ticker = {
  createElement,
  render,
}

// /** @jsx Ticker.createElement */
// const element = (
//   <div id="foo" style="background: salmon">
//     <h1 name="Bob">{`Hello ${name}`}</h1>
//     <button style="background: green" onClick={() => console.log('Clicked')}>
//       Press
//     </button>
//     <b></b>
//   </div>
// )

const container = document.getElementById('root')

function tick() {
  const time = new Date().toLocaleTimeString()
  const clockElement = <h1>{time}</h1>
  render(clockElement, container)
}

tick()
setInterval(tick, 1000)
Ticker.render(element, container)
