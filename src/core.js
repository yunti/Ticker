'use strict'

const element = <h1 title="foo">Hello</h1>
const element2 = React.createElement('h1', { title: 'foo' }, 'Hello')
const container = document.getElementById('root')
ReactDOM.render(element, container)
