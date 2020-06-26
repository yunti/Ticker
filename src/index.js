'use strict'

import Ticker from './ticker'

const stories = [
  { name: 'Didact introduction', url: 'http://bit.ly/2pX7HNn' },
  { name: 'Rendering DOM elements ', url: 'http://bit.ly/2qCOejH' },
  { name: 'Element creation and JSX', url: 'http://bit.ly/2qGbw8S' },
  { name: 'Instances and reconciliation', url: 'http://bit.ly/2q4A746' },
  { name: 'Components and state', url: 'http://bit.ly/2rE16nh' },
]

class App extends Ticker.Component {
  render() {
    return (
      <div>
        <h1>Ticker Stories</h1>
        <ul>
          {this.props.stories.map((story) => {
            return <Story name={story.name} url={story.url} />
          })}
        </ul>
      </div>
    )
  }
}

class Story extends Ticker.Component {
  constructor(props) {
    super(props)
    this.state = { likes: Math.ceil(Math.random() * 100) }
  }
  like() {
    this.setState({
      likes: this.state.likes + 1,
    })
  }
  render() {
    const { name, url } = this.props
    const { likes } = this.state
    const likesElement = <span />
    return (
      <li>
        <button onClick={(e) => this.like()}>
          {likes}
          <b>heart</b>
        </button>
        <a href={url}>{name}</a>
      </li>
    )
  }
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

// function tick() {
//   const time = new Date().toLocaleTimeString()
//   const clockElement = <h1>{time}</h1>
//   render(clockElement, container)
// }

// tick()
// setInterval(tick, 1000)
// Ticker.render(element, container)
Ticker.render(<App stories={stories} />, container)
