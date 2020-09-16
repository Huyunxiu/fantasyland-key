import React from 'react';
import Typed from 'react-typed';
import data from './data.json';
import Autosuggest from 'react-autosuggest';
import { debounce } from 'lodash';
import './App.css';

class App extends React.Component {

  MAX_SUGGESTIONS = 6;

  initState = {
    active: 0,
    data,
    initData: data,
    suggestions: [],
    searchValue: '',
  }

  constructor() {
    super();
    this.state = this.initState;
    this.debounceGetSuggestions = debounce(this.getSuggestions, 100);
  }

  componentDidMount() {
    window.addEventListener("scroll", this.onWindowScroll, false);
  }

  componentWillUnmount() {
      window.removeEventListener("scroll", this.onWindowScroll, false);
  }

  onWindowScroll = e => {
    const list = this.ulRef.childNodes;
    for (let i = 0; i < list.length; i++) {
        if (window.scrollY > list[i].offsetTop) {
            this.setState({ active: i });
        }
    }
  }

  onSideNavClick = name => {
    const node = document.querySelector(`#${name}`);
    node && node.scrollIntoView({behavior: 'smooth'});
  }

  onSearch = e => {
    console.log(this.state.searchValue)
  }

  getSuggestionValue = e => e.name;

  getSuggestions = (value) => {
    if (!value) return [];

    const suggestions = [];
    let count = 0;

    for (let menu of data) {
      for (let e of menu.children) {
        const nameIndex = e.name.toLowerCase().indexOf(value.toLowerCase());
        const contentIndex = e.content.toLowerCase().indexOf(value.toLowerCase());
        if (nameIndex !== -1 || contentIndex !== -1) {
          if (count < this.MAX_SUGGESTIONS) {
            count++;
            suggestions.push(e);
          } else {
            return suggestions;
          }
        }
      }
    }

    this.setState({ suggestions });
  }

  onSuggestionsFetchRequested = ({ value }) => {
    this.debounceGetSuggestions(value);
  };

  onSuggestionsClearRequested = () => {
    this.setState({ suggestions: [] });
  };

  renderSuggestion = (suggestion, { query }) => {
    const nameIndex = suggestion.name.toLowerCase().indexOf(query.toLowerCase());
    const contentIndex = suggestion.content.toLowerCase().indexOf(query.toLowerCase());
    const searchElement = {...suggestion};
    if (nameIndex !== -1 || contentIndex !== -1) {
      if (nameIndex !== -1) {
        searchElement.name = searchElement.name.substr(0, nameIndex) + '<span class="highlight">' + searchElement.name.substr(nameIndex, query.length) + '</span>' + searchElement.name.substr(nameIndex + query.length);
      }
      if (contentIndex !== -1) {
        searchElement.content = searchElement.content.substr(0, contentIndex) + '<span class="highlight">' + searchElement.content.substr(contentIndex, query.length) + '</span>' + searchElement.content.substr(contentIndex + query.length);
      }
    }

    return (
      <>
        <img src={searchElement.img} alt={suggestion.name} />
        <h3 dangerouslySetInnerHTML={{__html: searchElement.name}}></h3>
        <p dangerouslySetInnerHTML={{__html: searchElement.content}}></p>
      </>
    );
  }

  onSearchChange = (event, { newValue }) => {
    this.setState({
      searchValue: newValue
    });
  };

  onSuggestionSelected = (event, { suggestion}) => {
    window.open(suggestion.url, "_blank");
  }

  render () {
    const { active, data, searchValue, suggestions } = this.state;
    return (
      <div className="app">
      <header className="header">
        <div className="header-front">
          <div className="header-container">
              <div className="header-front-left">
                <a href="#" className="logo" tabIndex="-1">
                  FX.Tech. 
                  <sup>
                    <Typed
                      strings={[
                        '<span style="color: #ff708b">{ Back End }</span>',
                        '<span style="color: #ff708b">{ Back End }</span>',
                        '<span style="color: #62d0dd">{ Front End }</span>',
                        '<span style="color: #a2d39b">{ Application }</span>',
                        '<span style="color: #ff8e21">{ Operation }</span>']}
                        typeSpeed={50}
                        backSpeed={20}
                        loop >
                    </Typed>
                  </sup>
                </a>
              </div>
              <div className="header-front-middle"></div>
              <div className="header-front-right"></div>
            </div>
          </div>
      </header>
      <div className="content">
          <div className="container">
              <div className="sectors" ref={e => this.ulRef = e}>
                  <div className="sector">
                      <div className="search">
                          <Autosuggest
                            onSuggestionSelected={this.onSuggestionSelected}
                            suggestions={suggestions}
                            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                            getSuggestionValue={this.getSuggestionValue}
                            renderSuggestion={this.renderSuggestion}
                            inputProps={{
                              className: 'search-input',
                              autoFocus: true,
                              type: 'text',
                              value: searchValue,
                              onChange: this.onSearchChange
                            }}
                          />
                          <button className="search-button" onClick={this.onSearch}>站内搜索</button>
                      </div>
                  </div>
                  {
                    data.map(e => (
                      <div id={e.name} className="sector" key={e.name}>
                        <h2>{e.name}</h2>
                        <div className="links">
                          {e.children.map(item => (
                            <a href={item.url} key={item.name} className="link" target="_blank">
                                <img src={item.img} alt={item.name} />
                                <div className="info">
                                    <h3 dangerouslySetInnerHTML={{__html: item.name}}></h3>
                                    <p dangerouslySetInnerHTML={{__html: item.content}}></p>
                                </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    ))
                  }
            </div>
          </div>
          <div className="side-nav">
              <ul>
                  {data.map((e, i) => (
                    <li className={active === i ? 'active' : ''} key={e.name} onClick={() => this.onSideNavClick(e.name)}>
                        <span className="side-nav-dot"></span>
                        <span className="side-nav-title">{e.name}</span>
                    </li>
                  ))}
              </ul>
          </div>
      </div>
      <div className="footer">
          <div className="footer-bottom">
              <p className="copyright">
                  <span>Since 2020</span>
                  <span> • </span>
                  Built by
                  <a href="mailto:huyunxiu@fenxiangbuy.com"> 胡云修</a>
              </p>
              <p className="powered"><img src="https://img.shields.io/badge/proudly%20powered%20by%20Node.js-12.18.3-blue?style=flat-square&logo=Node.js" alt="a" /></p>
          </div>
      </div>
      </div>
    );
  };
}

export default App;
