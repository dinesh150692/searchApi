/* Library Imports */
import { combineReducers } from 'redux';
import ReduxThunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';


const ACTION_TYPE = {
    UPDATE_SEARCH_RESULT: 'UPDATE_SEARCH_RESULT'
}

function updateSearchResult(searchResult, searchParam, searchList) {
    searchList[searchParam] = searchResult;
    return { type: ACTION_TYPE.UPDATE_SEARCH_RESULT, searchList };
}

function searchReducer(state = {}, action) {
    switch (action.type) {
        case ACTION_TYPE.UPDATE_SEARCH_RESULT: 
            return action.searchList
        default:
            return state;
    }
}

function isJson(str) {
	try {
		return (JSON.parse(str) && !!str);
	} catch (e) {
		return false;
	}
}

function searchAPI(searchParam, searchResult) {
    let options = {
		method : 'GET',
		headers: {
			'Accept': '*/*',
			'content-type': 'application/json'
		}
    };
	let url = 'https://swapi.co/api/people/?search=' + searchParam;
	let resp ={};
    return dispatch => {
        return fetch(url, options)
        .then((response) => {
            let status = Number(response.status);
            if(status >= 200 &&  status < 300){    
                return response.text().then(str => { 
                    let isDataJson = isJson(str);
                    let data = '';
                    if (isDataJson) {
                        data = JSON.parse(str);
                        data.value = searchParam;
                        resp.data = data;
                        dispatch(updateSearchResult(data.results || [], searchParam, searchResult))
                    }else{
                        resp.data = {
                            code: 'SERVER_ERROR',
                            value: searchParam,
                            message: 'Something went wrong'
                        }
                        dispatch(updateSearchResult([], searchParam, searchResult))
                    }
                    return resp;
                });
            }else{
                resp.data = {
                    code: 'SERVER_ERROR',
                    value: searchParam,
                    message: 'Something went wrong'
                }
                dispatch(updateSearchResult([], searchParam, searchResult))
            }
            return resp;
        })
        .catch((error) => {
            resp.data = {
                code: 'SERVER_ERROR',
                value: searchParam,
                message: 'Something went wrong'
            }
            dispatch(updateSearchResult([], searchParam, searchResult))
            return resp;
        });
    };   
}

function configureStore(initialState) {
	return createStore(
		reducer,
		initialState,
		applyMiddleware(ReduxThunk)
	);
}

const reducer = combineReducers({searchList: searchReducer});

export {
    searchAPI,
    ACTION_TYPE,
    configureStore,
    updateSearchResult
}