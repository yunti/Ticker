'use strict'

let rootInstance = null
const TEXT_ELEMENT = 'TEXT_ELEMENT'

function createElement(type, config, ...args) {
  const props = Object.assign({}, config)
  const hasChildren = args.length > 0
  const rawChildren = hasChildren ? [].concat(...args) : []
  props.children = rawChildren
    .filter(c => c != null && c !== false)
    .map(c => (c instanceof Object ? c : createTextElement(c)))
  return { type, props }
}

function createTextElement(value) {
  return createElement(TEXT_ELEMENT, { nodeValue: value })
}

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
  } else if (instance.element.type !== element.type) {
    // Replace instance
    const newInstance = instantiate(element)
    parentDom.replaceChild(newInstance.dom, instance.dom)
    return newInstance
  } else if (typeof element.type === 'string') {
    // Update instance
    updateDomProperties(instance.dom, instance.element.props, element.props)
    instance.childInstances = reconcileChildren(instance, element)
    instance.element = element
    return instance
  } else {
    // Update composite instance
    instance.publicInstance.props = element.props
    const childElement = instance.publicInstance.render()
    const oldChildInstance = instance.childInstance
    const childInstance = reconcile(parentDom, oldChildInstance, childElement)
    instance.dom = childInstance.dom
    instance.childInstance = childInstance
    instance.element = element
    return instance
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
    newChildInstances.push(newChildInstance)
  }
  return newChildInstances.filter(instance => instance != null)
}

function instantiate(element) {
  const isDomElement = typeof element.type === 'string'

  if (isDomElement) {
    // Create DOM Element
    const dom =
      element.type === 'TEXT_ELEMENT'
        ? document.createTextNode('')
        : document.createElement(element.type)

    updateDomProperties(dom, [], element.props)

    // Instantiate and append children
    const childElements = element.props.children || []
    const childInstances = childElements.map(instantiate)
    const childDoms = childInstances.map(childInstance => childInstance.dom)
    childDoms.forEach(childDom => dom.appendChild(childDom))

    const instance = { dom, element, childInstances }
    return instance
  } else {
    // Instantiate component element
    const instance = {}
    const publicInstance = createPublicInstance(element, instance)
    const childElement = publicInstance.render()
    const childInstance = instantiate(childElement)
    const dom = childInstance.dom

    Object.assign(instance, { dom, element, childInstance, publicInstance })
    return instance
  }
}

function updateDomProperties(dom, prevProps, nextProps) {
  // blindly remove all events and props and add the new ones

  const isEvent = key => key.startsWith('on')
  const isProperty = key => !isEvent(key) && key !== 'children'

  // Remove event listeners
  Object.keys(prevProps)
    .filter(isEvent)
    .forEach(key => {
      const eventType = key.toLowerCase().substring(2)
      dom.removeEventListener(eventType, prevProps[key])
    })

  //Remove properties
  Object.keys(prevProps)
    .filter(isEvent)
    .forEach(key => {
      dom[key] = null
    })

  // Set properties on DOM Element
  Object.keys(nextProps)
    .filter(isProperty)
    .forEach(key => {
      dom[key] = nextProps[key]
    })

  // Add Event Listeners
  Object.keys(nextProps)
    .filter(isEvent)
    .forEach(key => {
      const eventType = key.toLowerCase().substring(2)
      dom.addEventListener(eventType, nextProps[key])
    })
}

function createPublicInstance(element, internalInstance) {
  const { type, props } = element
  const publicInstance = new type(props)
  publicInstance.__internalInstance = internalInstance
  return publicInstance
}

class Component {
  constructor(props) {
    this.props = props
    this.state = this.state || {}
  }

  setState(partialState) {
    this.state = Object.assign({}, this.state, partialState)
    updateInstance(this.__internalInstance)
  }
}

function updateInstance(internalInstance) {
  const parentDom = internalInstance.dom.parentNode
  const element = internalInstance.element
  reconcile(parentDom, internalInstance, element)
}

const Ticker = {
  createElement,
  render,
  Component,
}

export default Ticker
