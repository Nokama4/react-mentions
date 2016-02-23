import React, { Component, PropTypes } from 'react';
import { defaultStyle } from 'substyle';

import utils from './utils';

import Suggestion from "./Suggestion";

export default class SuggestionsOverlay extends Component {

  static propTypes = {
    suggestions: PropTypes.object.isRequired,

    isLoading: PropTypes.bool,

    onSelect: PropTypes.func,
  };

  static defaultProps = {
    suggestions: {},

    onSelect: () => null
  };

  render() {
    // do not show suggestions until there is some data
    if(utils.countSuggestions(this.props.suggestions) === 0 && !this.props.isLoading) {
      return null;
    }

    return (
      <div
        {...substyle(this.props)}
        onMouseDown={this.props.onMouseDown}>

        <ul {...substyle(this.props, "list") }>
          { this.renderSuggestions() }
        </ul>

        { this.renderLoadingIndicator() }
      </div>
    );
  }

  renderSuggestions() {
    return utils.getSuggestions(this.props.suggestions).reduce((result, { suggestions, descriptor }) => [
      ...result,

      ...suggestions.map((suggestion, index) => this.renderSuggestion(
        suggestion,
        descriptor,
        result.length + index
      ))
    ], []);
  }

  renderSuggestion(suggestion, descriptor, index) {
    let id = this.getID(suggestion);
    let isFocused = (index === this.props.focusIndex);

    let { mentionDescriptor, query } = descriptor;

    return (
      <Suggestion { ...substyle(this.props, "item") }
        key={ id }
        id={ id }
        ref={isFocused ? "focused" : null}
        query={ query }
        descriptor={ mentionDescriptor }
        suggestion={ suggestion }
        focused={ isFocused }
        onClick={ () => this.select(suggestion, descriptor) }
        onMouseEnter={ () => this.handleMouseEnter(index) } />
    );
  }

  getID(suggestion) {
    if(suggestion instanceof String) {
      return suggestion;
    }

    return suggestion.id;
  }

  renderLoadingIndicator () {
    if(!this.props.isLoading) {
      return;
    }

    return (
      <div { ...substyle(this.props, "loading-indicator") }>
        <div { ...substyle(this.props, "spinner") }>
          <div { ...substyle(this.props, "element1") } />
          <div { ...substyle(this.props, "element2") } />
          <div { ...substyle(this.props, "element3") } />
          <div { ...substyle(this.props, "element4") } />
          <div { ...substyle(this.props, "element5") } />
        </div>
      </div>
    );
  }

  handleMouseEnter(index, ev) {
    if(this.props.onMouseEnter) {
      this.props.onMouseEnter(index);
    }
  }

  select(suggestion, descriptor) {
    this.props.onSelect(suggestion, descriptor);
  }

};

const substyle = defaultStyle({
  position: "absolute",
  zIndex: 1,
  backgroundColor: "white",
  marginTop: 14,
  minWidth: 100,

  list: {
    margin: 0,
    padding: 0,
    listStyleType: "none",
  }
});
