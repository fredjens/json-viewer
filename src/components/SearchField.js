import React, { Component } from 'react';
import autoBind from 'auto-bind';

export default class SearchField extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    autoBind(this);
    this.state = {
      searchInput: '',
      searchActive: false,
    };
  }

  handleSearchInput(e) {
    const { value } = e.target;
    const { onChange} = this.props;

    this.setState({ searchInput: value }, () => {
      onChange(this.state.searchInput)
    });
  }

  toggleSearch() {
    this.setState({ searchActive: !this.state.searchActive });
  }

  render() {
    const { searchInput, searchActive } = this.state;

    const searchField = (
      <input
        type="text"
        className="search"
        placeholder="Search..."
        value={searchInput}
        onChange={this.handleSearchInput}
      />
    );

    return (
      <div>
        {searchActive && searchField}
        <button onClick={this.toggleSearch} style={{
          float: 'right',
        }}>
          {searchActive ? 'Close search' : 'Search JSON'}
        </button>
      </div>
    );
  }
}
