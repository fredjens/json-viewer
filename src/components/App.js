import React, { Component } from 'react';
import autoBind from 'auto-bind';
import { isEmpty } from 'lodash';

// import json from '../test-json/test-1.json';
import { checkIfInSearch } from '../utils/check-if-in-search';
import { fetchJSONfromUrl } from '../services/fetch-json-from-url';

import SearchField from './SearchField';
import ExpandIcon from './ExpandIcon';

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
            {checkIfInSearch(name, searchString)}: <strong>true ✅</strong>
          </li>
        );
      }

      if (json === false) {
        return (
          <li key={index}>
            {checkIfInSearch(name, searchString)}: <strong>false ❌</strong>
          </li>
        );
      }

      if (json === null) {
        return (
          <li key={index}>
            {checkIfInSearch(name, searchString)}: <strong>null 🅾️</strong>
          </li>
        );
      }

      if (typeof json === 'string') {
        return (
          <li key={index}>
            {checkIfInSearch(name, searchString)}: <strong>{checkIfInSearch(json, searchString)}</strong> 🆎
          </li>
        );
      }

      if (typeof json === 'number') {
        return (
          <li key={index}>
            {checkIfInSearch(name, searchString)}: <strong>{checkIfInSearch(json, searchString)}</strong> 🔢
          </li>
        );
      }

      if (typeof json === 'object') {
        return (
          <li key={index}>
            <button onClick={() => this.handleToggle(name)}>
              {!isEmpty(json) && <ExpandIcon expanded={toggleIndex.includes(name)} />}
              {checkIfInSearch(name, searchString)}: {json instanceof Array ? '👪' : '🌿'}
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
    const { json, loading, errorMessage } = this.state;

    return (
      <div>
        <form onSubmit={this.handleJSONurl}>
          <input
            type="text"
            placeholder="JSON url"
            className="search"
            onChange={this.updateFormField}
          />
        </form>
        {json &&
          <div style={{ marginTop: '20px' }}>
            <SearchField
              onChange={val => this.setState({ searchString: val })}
            />
            <button
              onClick={this.fetchData}
              style={{
                float: 'right',
              }}
            >Refetch</button>
          </div>
        }
        <ul>
          {json && !loading && this.renderJSON(json)}
        </ul>
        {!json && !errorMessage && !loading && '👆 Gimme som JSON'}
        {errorMessage && (<div>{`😞 ${errorMessage}`}</div>)}
        {loading && 'Loading JSON 😄'}
      </div>
    );
  }
}

export default App;
