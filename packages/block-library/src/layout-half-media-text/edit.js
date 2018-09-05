/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	BlockControls,
	InnerBlocks,
	InspectorControls,
	PanelColorSettings,
	withColors,
	MediaContainer,
} from '@wordpress/editor';
import { Component, Fragment } from '@wordpress/element';
import { withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { Toolbar } from '@wordpress/components';

/**
 * Constants
 */
const ALLOWED_BLOCKS = [ 'core/button', 'core/paragraph', 'core/heading', 'core/list' ];
const TEMPLATE = [
	[ 'core/paragraph', { fontSize: 'large', placeholder: 'Content…' } ],
];
const MAX_MEDIA_WIDTH = 900;

class ImageEdit extends Component {
	constructor() {
		super( ...arguments );

		this.onSelectMedia = this.onSelectMedia.bind( this );
		this.onWidthChange = this.onWidthChange.bind( this );
	}

	onSelectMedia( media ) {
		const { setAttributes } = this.props;
		const newMediaWidth = Math.min( parseInt( media.width ), MAX_MEDIA_WIDTH );

		setAttributes( {
			mediaAlt: media.alt,
			mediaId: media.id,
			mediaType: media.type,
			mediaUrl: media.url,
			mediaWidth: newMediaWidth,
		} );
	}

	onWidthChange( width ) {
		const { setAttributes } = this.props;

		setAttributes( {
			mediaWidth: width,
		} );
	}

	renderMediaArea() {
		const { attributes } = this.props;
		const { mediaAlt, mediaId, mediaPosition, mediaType, mediaUrl, mediaWidth } = attributes;

		return (
			<MediaContainer
				maxWidth={ MAX_MEDIA_WIDTH }
				className="block-library-half-media__media-container"
				onSelectMedia={ this.onSelectMedia }
				onWidthChange={ this.onWidthChange }
				{ ...{ mediaAlt, mediaId, mediaType, mediaUrl, mediaPosition, mediaWidth } }
			/>
		);
	}

	render() {
		const { attributes, backgroundColor, setAttributes, setBackgroundColor } = this.props;
		const { mediaPosition } = attributes;
		const className = classnames( 'wp-block-half-media', {
			'has-media-on-the-right': 'right' === mediaPosition,
			[ backgroundColor.class ]: backgroundColor.class,
		} );
		const style = {
			backgroundColor: backgroundColor.value,
		};
		const colorSettings = [ {
			value: backgroundColor.value,
			onChange: setBackgroundColor,
			label: __( 'Background Color' ),
		} ];
		return (
			<Fragment>
				<InspectorControls>
					<PanelColorSettings
						title={ __( 'Color Settings' ) }
						initialOpen={ false }
						colorSettings={ colorSettings }
					/>
				</InspectorControls>
				<BlockControls>
					<Toolbar
						controls={ [ {
							icon: 'align-left',
							title: __( 'Show media on left' ),
							isActive: mediaPosition === 'left',
							onClick: () => setAttributes( { mediaPosition: 'left' } ),
						}, {
							icon: 'align-left',
							title: __( 'Show media on right' ),
							isActive: mediaPosition === 'right',
							onClick: () => setAttributes( { mediaPosition: 'right' } ),
						} ] }
					/>
				</BlockControls>
				<div className={ className } style={ style } >
					{ this.renderMediaArea() }
					<InnerBlocks
						allowedBlocks={ ALLOWED_BLOCKS }
						template={ TEMPLATE }
					/>
				</div>
			</Fragment>
		);
	}
}

export default compose( [
	withColors( 'backgroundColor' ),
	withSelect( ( select ) => {
		return {
			wideControlsEnabled: select( 'core/editor' ).getEditorSettings().alignWide,
		};
	} ),
] )( ImageEdit );
