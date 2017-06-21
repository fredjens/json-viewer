import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { isEmpty } from 'lodash';
import Highlight from 'react-highlighter';

import { fetchJSONfromUrl } from '../services/fetch-json-from-url';

import SearchField from './SearchField';
import ExpandIcon from './ExpandIcon';

// const url = 'https://api.nasa.gov/planetary/apod?api_key=NNKOjkoul8n1CH18TWA9gwngW1s1SmjESPjNoUFo';

class App extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      searchString: '',
      url: '',
      toggleIndex: [],
      errorMessage: '',
      json: null,
    };
  }

  // static defaultProps = { json };

  async fetchData() {
    const { url } = this.state;

    if (url === '') {
      return this.setState({ errorMessage: '' });
    }

    this.setState({
      loading: true,
      errorMessage: '',
    });

    const json = await fetchJSONfromUrl(url);

    const { error = '', data = {} } = json;

    if (error) {
      return this.setState({
        errorMessage: error,
        loading: false,
      });
    }

    this.setState({ json: data, loading: false });
  }


  async handleJSONurl(e) {
    e.preventDefault();
    this.fetchData();
  }

  updateFormField(e) {
    this.setState({
      url: e.target.value,
      errorMessage: '',
    });
  }

  handleToggle(name) {
    if (this.state.toggleIndex.includes(name)) {
      const newToggleIndex = this.state.toggleIndex
      .filter(index => index !== name);

      return this.setState({
        ...this.state,
        toggleIndex: newToggleIndex,
      });
    }

    this.setState({
      ...this.state,
      toggleIndex: [
        ...this.state.toggleIndex,
        name,
      ],
    });
  };

  renderJSON(data) {
    const { searchString, toggleIndex } = this.state;

    const childrenNodes = ({ json = {}, name = '', index }) => {
      if (json === true) {
        return (
          <li key={index}>
            <span className="def">
              ✅ <Highlight search={searchString}>{name}</Highlight>
            </span>
            <span className="val">true</span>
          </li>
        );
      }

      if (json === false) {
        return (
          <li key={index}>
            <span className="def">
              ❌ <Highlight search={searchString}>{name}</Highlight>
            </span>
            <span className="val">false</span>
          </li>
        );
      }

      if (json === null) {
        return (
          <li key={index}>
            <span className="def">
              🅾️ <Highlight search={searchString}>{name}</Highlight>
            </span>
            <span className="val">null</span>
          </li>
        );
      }

      if (typeof json === 'string') {
        return (
          <li key={index}>
            <span className="def">
              🆎 <Highlight search={searchString}>{name}</Highlight>
            </span>
            <span className="val"><Highlight search={searchString}>{json}</Highlight></span>
          </li>
        );
      }

      if (typeof json === 'number') {
        return (
          <li key={index}>
            <span className="def">
              🔢 <Highlight search={searchString}>{name}</Highlight>
            </span>
            <span className="val"><Highlight search={searchString}>{json}</Highlight></span>
          </li>
        );
      }

      if (typeof json === 'object') {
        return (
          <li key={index}>
            <button onClick={() => this.handleToggle(name)}>
              {!isEmpty(json) && <ExpandIcon expanded={toggleIndex.includes(name)} />}
              {json instanceof Array ? '👪 ' : '🌿 '}
              <Highlight search={searchString}>{name}</Highlight>
            </button>
            <ul style={{
              display: toggleIndex.includes(name) ? 'block' : 'none'
            }}>{this.renderJSON(json)}</ul>
          </li>
        );
      }
    }

    return Object.keys(data).map((node, index) => {
      return childrenNodes({ json: data[node], name: node, index });
    });
  }

  render() {
    const { json, loading, errorMessage, url, searchString } = this.state;

    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        minHeight: '100vh',
        padding: '2rem',
      }}>
        <div style={{
          width: '100%',
        }}>
          <h1 style={{
            fontSize: json ? '1rem' : '2rem',
          }}>JSON data viewer</h1>
          {searchString.length <= 0 &&
            <form onSubmit={this.handleJSONurl} style={{ marginBottom: '.5rem'}}>
              <input
                type="text"
                placeholder="👉 Gimme some JSON"
                className="search"
                onChange={this.updateFormField}
                value={url}
              />
            </form>
          }
          {json &&
            <div style={{ marginTop: '20px' }}>
              <SearchField
                onChange={val => this.setState({ searchString: val })}
              />
            </div>
          }
          <button
            className="btn"
            onClick={this.fetchData}
            style={{
              float: 'right',
            }}
          >
            {json ? 'Refetch' : 'Fetch'}
          </button>
          <Highlight search={searchString}>
            <ul>
              {json && !loading && this.renderJSON(json)}
            </ul>
          </Highlight>
          {errorMessage && (<div>{`😞 ${errorMessage}`}</div>)}
          {loading && 'Loading... 😄'}
          {!json && (
            <div style={{
              marginTop: '4rem',
              display: 'block',
              fontSize: '.8rem',
            }}>
              <h3>Data types:</h3>
              🌿 Objects<br />
              👪 Arrays<br />
              🔢 Strings<br />
              🆎 Numbers<br />
              🅾️ Null<br />
              ✅ True<br />
              ❌ False
            </div>
          )}
        </div>

      </div>
    );
  }
}

export default App;
