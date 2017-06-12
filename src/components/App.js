import React, { Component } from 'react';
import autoBind from 'auto-bind';

import json from '../test-json/test-1.json';
import { checkIfInSearch } from '../utils/check-if-in-search';

class App extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = { search: '', toggle: false };
  }

  static defaultProps = { json };

  handleToggle() {
    this.setState({ toggle: !this.state.toggle });
  };

  handleSearchInput(e) {
    const { value } = e.target;
    this.setState({ search: value });
  }

  renderJSON(data) {
    const { search, toggle } = this.state;

    const childrenNodes = ({ json = {}, name = '', index }) => {
      if (typeof json === 'object') {
        return (
          <li key={index} onClick={this.handleToggle} style={{ cursor: 'pointer' }}>
            {checkIfInSearch(name, search)}: {json instanceof Array ? '👪' : '🌿'}
            <ul style={{ display: toggle ? 'none' : 'block' }}>{this.renderJSON(json)}</ul>
          </li>
        );
      }

      if (typeof json === 'string') {
        return (
          <li key={index}>
            {checkIfInSearch(name, search)}: <strong>{checkIfInSearch(json, search)}</strong> 🆎
          </li>
        );
      }

      if (typeof json === 'number') {
        return (
          <li key={index}>
            {checkIfInSearch(name, search)}: <strong>{checkIfInSearch(json, search)}</strong> 🔢
          </li>
        );
      }
    }

    return Object.keys(data).map((node, index) => {
      return childrenNodes({ json: data[node], name: node, index });
    });
  }

  render() {
    const { json = {} } = this.props;
    const { search } = this.state;

    return (
      <div>
        <input
          type="text"
          className="search"
          placeholder="Search..."
          value={search}
          onChange={this.handleSearchInput}
        />
        <ul>
          {this.renderJSON(json)}
        </ul>
      </div>
    );
  }
}

export default App;
