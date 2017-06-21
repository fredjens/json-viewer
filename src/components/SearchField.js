import React, { Component } from 'react';
import autoBind from 'react-autobind';

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
    const { onChange } = this.props;
    const { searchActive } = this.state;

    if (searchActive) {
      this.setState({
        searchActive: false,
        searchInput: '',
      });

      return onChange('');
    };

    this.setState({
      searchActive: true,
    }, () => this.searchInput.focus());
  }

  render() {
    const { searchInput, searchActive } = this.state;

    const fixed = {
      position: 'fixed',
      right: '0',
      top: '50%',
      transform: 'translateX(-50%)',
      boxShadow: '2px 2px 1px #444',
    };

    const searchField = (
      <div style={searchInput.length === 0 ? fixed : {}}>
        <input
          type="text"
          className="search"
          placeholder="Search..."
          value={searchInput}
          onChange={this.handleSearchInput}
          ref={ref => { this.searchInput = ref; }}
        />
      </div>
    );

    return (
      <div>
        {searchActive && searchField}
        <button
          className="btn"
          onClick={this.toggleSearch}
          style={{
            float: 'right',
          }}
        >
          {searchActive ? 'Close search' : 'Search'}
        </button>
      </div>
    );
  }
}
