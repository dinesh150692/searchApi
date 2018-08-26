import React, { Component } from 'react';
import { connect } from 'react-redux';
import  { searchAPI } from './redux/index';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state ={
      value: '',
      error: '',
      loading: false,
      searchResult: []
    }
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    this.setState({value: event.target.value, loading: true, searchResult: [], error: ''}, () => {
      this.props.searchAPI(this.state.value).then(response => {
        if(response.data.hasOwnProperty('code')){
            this.setState({error: 'Something went wrong, retry again', loading: false});
        }else if(response.data.count > 0 && response.data.value === this.state.value){
            this.setState({error: '', searchResult: response.data.results, loading: false});
        }else if(response.data.count === 0 && response.data.value === this.state.value){
          this.setState({error: 'No data found', searchResult: [], loading: false});
        }
      });   
    });
    
  }

  renderSearchList(){
    if(this.state.searchResult.length > 0){
      return(
        <div className='searchContainer'>
            {this.state.searchResult.map(item => {
                return(
                  <div key={item.created} className='searchItem'>{item.name}</div>
                )
            })}
        </div>
      )
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <input className="input" onChange={this.handleInputChange} placeholder={"Search for starwars people"}/>
        </header>
        <div>
          {this.state.loading && 
            <div className="loader" />
          }
          {!this.state.loading && 
            (this.state.error || this.state.searchResult.length === 0)? 
              <div className="error">{this.state.error}</div>
            : 
             this.renderSearchList()
          }
        </div>
      </div>
    );
  }
}

/** 
*  Mapping the props for the desired dispatch actions
*/
const mapDispatchToProps = {
  searchAPI
};

export default connect(null, mapDispatchToProps)(App);