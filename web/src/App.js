import React from 'react';
import Typed from 'react-typed';
import data from './data.json';
import './App.css';

class App extends React.Component {

  initState = {
    active: 0,
    data,
    initData: data,
  }

  constructor() {
    super();
    this.state = this.initState;
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
    if (e.which !== 13) return;
    const value = e.target.value;

    if (!value || !value.trim()) {
      this.setState({ data: this.state.initData });
      return;
    }
    
    const result = {};
    for (let menu of data) {
      for (let e of menu.children) {
        if (e.name.indexOf(value) !== -1 || e.content.indexOf(value) !== -1) {
          if (result[menu.name]) {
            result[menu.name].children.push(e);
          } else {
            result[menu.name] = {...menu, children: [e]};
          }
        }
      }
    }

    this.setState({ data: Object.values(result) });
  }

  render () {
    const { active, data } = this.state;
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
                          <input type="text" className="search-input" autoFocus onKeyPress={this.onSearch} />
                          <button className="search-button" onClick={this.onSearch}>站内搜索</button>
                      </div>
                  </div>
                  {
                    data.map(e => (
                      <div id={e.name} className="sector" key={e.name}>
                        <h2>{e.name}</h2>
                        <div className="links">
                          {e.children.map(item => (
                            <a href={item.href} key={item.name} className="link" target="_blank">
                                <img src={item.img} alt={item.name} />
                                <div className="info">
                                    <h3>{item.name}</h3>
                                    <p>{item.content}</p>
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
  }
}

export default App;
