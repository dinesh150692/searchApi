import React, { Component } from 'react';
import { connect } from 'react-redux';
import  { searchAPI } from './redux/index';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state ={
      value: '',
      loading: false,
    }
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    this.setState({value: event.target.value},() => {
      if(this.state.value){
        if(this.props.searchList && Object.keys(this.props.searchList).length > 0 && this.props.searchList[this.state.value]){
          return;
        }
        this.setState({loading: true}, () => {
          this.props.searchAPI(this.state.value, this.props.searchList).then(response => {
            this.setState({loading: false});
          });;
        });
      }
    });    
  }

  renderSearchList(){
    let searchResult = this.props.searchList[this.state.value];
    if(this.props.searchList && Object.keys(this.props.searchList).length > 0 && searchResult && searchResult.length > 0){
      return(
        <div className='searchContainer'>
            {searchResult.map(item => {
                return(
                  <div key={item.created} className='searchItem'>{item.name}</div>
                )
            })}
        </div>
      )
    }else{
      return(
        <div className="error">No data found</div>
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
          {this.state.loading && <div className="loader" />}
          {!this.state.loading && this.state.value !== '' &&  this.renderSearchList()}
        </div>
      </div>
    );
  }
}

/** 
 *  Mapping the state to desired props for the component
 */
function mapStateToProps(state, ownProps) {
  return {
    searchList: state.searchList
  };
}


/** 
*  Mapping the props for the desired dispatch actions
*/
const mapDispatchToProps = {
  searchAPI
};

export default connect(mapStateToProps, mapDispatchToProps)(App);