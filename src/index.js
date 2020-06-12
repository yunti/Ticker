'use strict'

const element = {
  type: 'h1',
  props: {
    title: 'foo',
    children: 'Heasdfsafllo',
  },
}
const container = document.getElementById('root')

const node = document.createElement(element.type)
node['title'] = element.props.title

const text = document.createTextNode('')
text['nodeValue'] = element.props.children

node.appendChild(text)
container.appendChild(node)

const element2 = (
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
      children,
    },
  }
}
