/**
 * HGV Depencency checker
 *
 * @author WPEngine
 */

'use strict';

/**
 * Test dependencies
 */
var assert = require( 'chai' ).assert,
	chalk = require( 'chalk' ),
	events = require( 'events' ),
	proxyquire = require( 'proxyquire' ).noCallThru();

/**
 * Set up mocks
 */
function Exec() {}
Exec.prototype = new events.EventEmitter();

// Vagrant return array
var returnArray = [];

var myExec = function( command, callback ) {
	var emitter = new Exec();

	switch ( command ) {
	case 'no_such_version':
		callback.apply( null, [true, undefined] );
		break;
	case 'outdated_version':
		callback.apply( null, [false, '1.0.0'] );
		break;
	case 'valid_version':
		callback.apply( null, [false, '2.0.0'] );
		break;
	case 'vagrant plugin list':
		callback.apply( null, returnArray );
		break;
	}

	setTimeout( function() { emitter.emit( 'close' ); }, 10 );

	return emitter;
};

var Checker = proxyquire( '../lib/components/checker', {
	child_process: {
		exec: myExec
	}
} );

describe( 'Checker', function() {
	describe( 'CLI', function() {
		it( 'errors if no installation', function( done ) {
			var message = '',
				stdout = process.stdout.write;

			// Set up polyfills
			process.stdout.write = function( msg ) { message += msg; };

			Checker.cli( 'Git', '2.0.0', 'no_such_version' ).then( function() {

				// Verify
				assert.include( chalk.stripColor( message.trim() ), 'No installation of Git is detected!' );

				// Reset
				process.stdout.write = stdout;

				done();
			} ).catch( done );
		} );

		it( 'errors on outdated installation', function( done ) {
			var message = '',
				stdout = process.stdout.write;

			// Set up polyfills
			process.stdout.write = function( msg ) { message += msg; };

			Checker.cli( 'Git', '2.0.0', 'outdated_version' ).then( function() {

				// Verify
				assert.include( chalk.stripColor( message.trim() ), 'Git v1.0.0 is installed. You need at least v2.0.0!' );

				// Reset
				process.stdout.write = stdout;

				done();
			} ).catch( done );
		} );

		it( 'succeeds with proper install', function( done ) {
			var message = '',
				stdout = process.stdout.write;

			// Set up polyfills
			process.stdout.write = function( msg ) { message += msg; };

			Checker.cli( 'Git', '2.0.0', 'valid_version' ).then( function() {

				// Verify
				assert.include( chalk.stripColor( message.trim() ), 'Git v2.0.0 looks good!' );

				// Reset
				process.stdout.write = stdout;

				done();
			} ).catch( done );
		} );
	} );

	describe( 'Vagrant', function() {
		it( 'errors if no Vagrant plugins', function( done ) {
			returnArray = [true, undefined];

			var message = '',
				stdout = process.stdout.write;

			// Set up polyfills
			process.stdout.write = function( msg ) { message += msg; };

			Checker.vagrant( 'Vagrant Ghost', '0.2.1', 'vagrant-ghost' ).then( function() {

				// Verify
				assert.include( chalk.stripColor( message.trim() ), 'Unable to detect any Vagrant plugins.' );

				// Reset
				process.stdout.write = stdout;

				done();
			} ).catch( done );
		} );

		it( 'errors if no plugin installation', function( done ) {
			returnArray = [false, ''];

			var message = '',
				stdout = process.stdout.write;

			// Set up polyfills
			process.stdout.write = function( msg ) { message += msg; };

			Checker.vagrant( 'Vagrant Ghost', '0.2.1', 'vagrant-ghost' ).then( function() {

				// Verify
				assert.include( chalk.stripColor( message.trim() ), 'The Vagrant Ghost plugin (recommended) was not detected!' );

				// Reset
				process.stdout.write = stdout;

				done();
			} ).catch( done );
		} );

		it( 'errors if outdated plugin installation', function( done ) {
			returnArray = [false, 'vagrant-ghost (0.2.0)'];

			var message = '',
				stdout = process.stdout.write;

			// Set up polyfills
			process.stdout.write = function( msg ) { message += msg; };

			Checker.vagrant( 'Vagrant Ghost', '0.2.1', 'vagrant-ghost', function() { return '0.2.0'; } ).then( function() {

				// Verify
				assert.include( chalk.stripColor( message.trim() ), 'Vagrant Ghost v0.2.0 is installed. You need at least v0.2.1!' );

				// Reset
				process.stdout.write = stdout;

				done();
			} ).catch( done );
		} );

		it( 'succeeds with proper plugin install', function( done ) {
			returnArray = [false, 'vagrant-ghost (0.2.1)'];

			var message = '',
				stdout = process.stdout.write;

			// Set up polyfills
			process.stdout.write = function( msg ) { message += msg; };

			Checker.vagrant( 'Vagrant Ghost', '0.2.1', 'vagrant-ghost', function() { return '0.2.1'; } ).then( function() {

				// Verify
				assert.include( chalk.stripColor( message.trim() ), 'Vagrant Ghost v0.2.1 looks good!' );

				// Reset
				process.stdout.write = stdout;

				done();
			} ).catch( done );
		} );
	} );
} );