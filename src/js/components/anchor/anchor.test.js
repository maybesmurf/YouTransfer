// Unit test for MODULE_NAME component
// Mocha and Chai are always included
'use strict';

var $ = require('jquery');
var sinon = require('sinon');
var anchor = require('./anchor');

describe('Anchor component', function() {

	var sandbox;

	beforeEach(function() {
		$('body').empty();
		sandbox = sinon.sandbox.create();
		$(document).off('xhr.loaded.anchor');
		$(document).off('component.anchor.success');
	});

	afterEach(function() {
		sandbox.restore();
		$(document).off('xhr.loaded.anchor');
		$(document).off('component.anchor.success');
	});

	it('should try to retrieve the url using JQuery XHR and replace target with result', function(done) {

		var fixture = getFixture();
		var instance = new anchor(fixture);

		sandbox.stub($, 'get', function (url) {
			should.exist(url);
			url.should.equals('http://someurl/');

			var d = $.Deferred();
			d.resolve('<div id="target">content</div>');
			return d.promise();
		});

		$(document).on('xhr.loaded.anchor', function(event, element, $target) {
			should.exist(element);
			element.should.equals(fixture);
			$target.selector.should.equals('#target');
			$target.html().should.equals('content');
			$.get.calledOnce.should.equals(true);
			$(document).off('xhr.loaded.anchor');
		});

		$(document).on('component.anchor.success', function() {
			done();
		})

		$(fixture).click();
	});

});

function getFixture() {
	var fixture = document.createElement('a');
	fixture.setAttribute('href', 'http://someurl/');
	fixture.setAttribute('data-target', 'target');

	var target = document.createElement('div');
	target.id = 'target';
	document.body.appendChild(target);

	return fixture;
}