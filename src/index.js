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
    // Create instance
    const newInstance = instantiate(element)
    parentDom.appendChild(newInstance.dom)
    return newInstance
  } else if (element == null) {
    // Remove instance
    parentDom.removeChild(instance.dom)
    return null
  } else if (instance.element.type === element.type) {
    // Update instance
    updateDomProperties(instance.dom, instance.element.props, element.props)
    instance.childInstances = reconcileChildren(instance, element)
    instance.element = element
    return instance
  } else {
    // Replace instance
    const newInstance = instantiate(element)
    parentDom.replaceChild(newInstance.dom, instance.dom)
    return newInstance
  }
}

function reconcileChildren(instance, element) {
  const dom = instance.dom
  const childInstances = instance.childInstances
  const nextChildElements = element.props.children || []
  const newChildInstances = []
  const count = Math.max(childInstances.length, nextChildElements.length)
  for (let i = 0; i < count; i++) {
    const childInstance = childInstances[i]
    const childElement = nextChildElements[i]
    const newChildInstance = reconcile(dom, childInstance, childElement)
    newChildInstance.push(newChildInstance)
  }
  return newChildInstances.filter((instance) => instance != null)
}

function instantiate(element, parentDom) {
  // Create DOM Element
  const dom =
    element.type === 'TEXT_ELEMENT'
      ? document.createTextNode('')
      : document.createElement(element.type)

  updateDomProperties(dom, [], element.props)

  // Instantiate and append children
  const childElements = element.props.children || []
  const childInstances = childElements.map(instantiate)
  const childDoms = childInstances.map((childInstance) => childInstance.dom)
  childDoms.forEach((childDom) => dom.appendChild(childDom))

  const instance = { dom, element, childInstances }
  return instance
}

function updateDomProperties(dom, prevProps, nextProps) {
  // blindly remove all events and props and add the new ones

  const isEvent = (key) => key.startsWith('on')
  const isProperty = (key) => !isEvent(key) && key !== 'children'

  // Remove event listeners
  Object.keys(prevProps)
    .filter(isEvent)
    .forEach((key) => {
      const eventType = key.toLowerCase().substring(2)
      dom.removeEventListener(eventType, prevProps(key))
    })

  //Remove properties
  Object.keys(prevProps)
    .filter(isEvent)
    .forEach((key) => {
      dom[key] = null
    })

  // Set properties on DOM Element
  Object.keys(nextProps)
    .filter(isProperty)
    .forEach((key) => {
      dom[key] = nextProps[key]
    })

  // Add Event Listeners
  Object.keys(nextProps)
    .filter(isEvent)
    .forEach((key) => {
      const eventType = key.toLowerCase().substring(2)
      dom.addEventListener(eventType, nextProps[key])
    })
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
// Ticker.render(element, container)
