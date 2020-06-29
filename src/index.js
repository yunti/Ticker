'use strict'

import Ticker from './ticker'

const stories = [
  {
    name: 'Novak Djokovic',
    url: 'https://en.wikipedia.org/wiki/Novak_Djokovic',
  },
  { name: 'Rafael Nadal', url: 'https://en.wikipedia.org/wiki/Rafael_Nadal' },
  { name: 'Bjorn Borg', url: 'https://en.wikipedia.org/wiki/Björn_Borg' },
  { name: 'Pete Sampras', url: 'https://en.wikipedia.org/wiki/Pete_Sampras' },
  { name: 'Ivan Lendl', url: 'https://en.wikipedia.org/wiki/Ivan_Lendl' },
]

class App extends Ticker.Component {
  render() {
    return (
      <div>
        <h1>Vote for the best tennis play ever</h1>
        <ul>
          {this.props.stories.map(story => {
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
        <button onClick={e => this.like()}>
          {likes}
          <b>👍</b>
        </button>
        <a href={url}>{name}</a>
      </li>
    )
  }
}

const container = document.getElementById('root')

Ticker.render(<App stories={stories} />, container)
