import React, { Component } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import { withRouter } from "react-router-dom"
import { SearchWrapper } from "./styles"
import Input from "@material-ui/core/Input"
import Checkbox from "@material-ui/core/Checkbox"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Divider from "@material-ui/core/Divider"
import Button from "@material-ui/core/Button"
import LinearProgress from "@material-ui/core/LinearProgress"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"

import * as actions from "../../actions"
import Recipe from "../Recipe"

const ingredientList = ["flour", "sugar", "salt", "butter", "milk"]

class Search extends Component {
  constructor(props) {
    super(props)
    this.handleSearch = this.handleSearch.bind(this)
    this.handleIngredient = this.handleIngredient.bind(this)
    this.fetchSearch = this.fetchSearch.bind(this)
    this.handleClickRecipe = this.handleClickRecipe.bind(this)
    this.state = {
      term: this.props.location.state?.term || "",
      ingredients: this.props.location.state?.ingredients || ["milk"]
    }
    // dispatch a search action if search data was provided via router state
    if(this.props.location?.state) {
      const {term, ingredients} = this.props.location.state
      this.props.searchRecipes(term, ingredients)
    }
  }
  fetchSearch() {
    const { term, ingredients } = this.state
    // add state to history entry to allow preserving search data on reload
    this.props.history.replace(this.props.location.pathname, this.state);
    this.props.searchRecipes(term, ingredients)
  }

  handleSearch(event) {
    const term = event.target.value
    this.setState({ term })
  }
  handleClickRecipe(recipe) {
    this.props.fetchRecipeById(recipe.id)
  }
  handleIngredient(ingredient, event) {
    const { ingredients } = { ...this.state }
    if (event.target.checked) {
      ingredients.push(ingredient)
    } else {
      const foundIngredient = ingredients.indexOf(ingredient)
      ingredients.splice(foundIngredient, 1)
    }
    this.setState({ ingredients })
  }
  render() {
    const { term, ingredients } = this.state
    const { recipes, isLoading } = this.props
    return (
      <SearchWrapper>
        <Input
          autoFocus={true}
          fullWidth={true}
          onChange={this.handleSearch}
          value={term}
        />
        <div>
          <h3>Ingredients on hand</h3>
          {ingredientList.map((ingredient) => (
            <FormControlLabel
              key={ingredient}
              control={
                <Checkbox
                  checked={ingredients.includes(ingredient)}
                  onChange={this.handleIngredient.bind(this, ingredient)}
                  value={ingredient}
                />
              }
              label={ingredient}
            />
          ))}
        </div>
        <Button onClick={this.fetchSearch}>search</Button>
        <Divider />
        {recipes && (
          <List>
            {recipes.map((recipe) => (
              <ListItem key={recipe.id} button={true} onClick={() => this.handleClickRecipe(recipe)}>
                <ListItemText primary={recipe.name} />
              </ListItem>
            ))}
          </List>
        )}
        {isLoading && <LinearProgress />}
        <Divider />
        <Recipe />
      </SearchWrapper>
    )
  }
}

const mapStateToProps = (state) => {
  const { search } = state
  return { ...search }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      searchRecipes: actions.searchRecipes,
      fetchRecipeById: actions.fetchRecipeById
    },
    dispatch
  )

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Search))
