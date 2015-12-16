import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import FacebookLogin from '../src/facebook';

describe('Validations', () => {
	let FacebookLogin;

	beforeEach(() => {
    FacebookLogin = TestUtils.renderIntoDocument(
      <FacebookLogin appId="1088597931155576" callback={(user)=>{}} />
    );
    // inputs = TestUtils.scryRenderedDOMComponentsWithTag(card, 'input');
    // button = TestUtils.scryRenderedDOMComponentsWithTag(card, 'button');
  });

	it('Return messages erros not facebook id', () => {
		console.log(FacebookLogin);
	});
});
