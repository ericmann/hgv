/**
 * HGV Version Filters
 *
 * @author WPEngine
 */

'use strict';

/**
 * Module dependencies
 */
var semver = require( 'semver' );

/**
 * Convert a Git version string into a real version number.
 *
 * @param {String} raw Output from `git --version`
 *
 * @returns {String}
 */
function git( raw ) {
	var parts = raw.trim().split( ' ' ),
		version = parts[2];

	return semver.clean( version.split( '.' ).slice( 0, 3 ).join( '.' ) );
}

/**
 * Convert a Vagrant version string into a real version number.
 *
 * @param {String} raw Output from `vagrant --version`
 *
 * @returns {String}
 */
function vagrant( raw ) {
	return semver.clean( raw.replace( /vagrant/i, '' ) );
}

/**
 * Convert a Vagrant plugin version string into a real version number.
 *
 * @param {String} raw
 * @param {String} plugin_name
 *
 * @returns {String}
 */
function vagrant_plugin( raw, plugin_name ) {
	var regex = new RegExp( plugin_name, 'i' );

	return semver.clean( raw.trim().replace( regex, '' ).replace( /\(|\)/g, '' ) );
}

/**
 * Export the module
 */
module.exports = {
	git           : git,
	vagrant       : vagrant,
	vagrant_plugin: vagrant_plugin
};