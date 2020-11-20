import {
    GET_RECIPES,
    ADD_RECIPE,
    DELETE_RECIPE,
} from './Types';

// eslint-disable-next-line import/no-anonymous-default-export
export default (state, action) => {
    switch (action.type) {
        case GET_RECIPES:
            return {
                ...state,
                recipe: action.payload
            };

        case ADD_RECIPE:
            return {
                ...state,
                recipes: [action.payload, ...state.recipes]
            };

        case DELETE_RECIPE:
            return {
                ...state,
                recipes: state.recipes.filter(recipe => recipe.id !== action.payload)
            }
        default:
            return state;
    }
};