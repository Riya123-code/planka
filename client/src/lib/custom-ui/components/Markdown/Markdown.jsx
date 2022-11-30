import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

import './Markdown.module.scss'; // FIXME: import as styles?

const ABSOLUTE_URL_REGEX = /^(?:https?:)?\/\//i;

const Markdown = React.memo(({ linkStopPropagation, ...props }) => {
  const handleLinkClick = useCallback((event) => {
    event.stopPropagation();
  }, []);

  const linkRenderer = useCallback(
    /* eslint-disable jsx-a11y/anchor-has-content,
                      jsx-a11y/click-events-have-key-events,
                      jsx-a11y/no-static-element-interactions,
                      react/jsx-props-no-spreading */
    ({ node, ...linkProps }) => (
      <a
        {...linkProps}
        rel={
          ABSOLUTE_URL_REGEX.test(linkProps.href) && linkProps.target === '_blank'
            ? 'noreferrer'
            : undefined
        }
        onClick={linkStopPropagation ? handleLinkClick : undefined}
      />
    ),
    /* eslint-enable jsx-a11y/anchor-has-content,
                     jsx-a11y/click-events-have-key-events,
                     jsx-a11y/no-static-element-interactions,
                     react/jsx-props-no-spreading */
    [linkStopPropagation, handleLinkClick],
  );

  return (
    <ReactMarkdown
      {...props} // eslint-disable-line react/jsx-props-no-spreading
      components={{
        a: linkRenderer,
      }}
      remarkPlugins={[remarkGfm, remarkBreaks]}
      className="markdown-body"
    />
  );
});

Markdown.propTypes = {
  linkStopPropagation: PropTypes.bool,
};

Markdown.defaultProps = {
  linkStopPropagation: false,
};

export default Markdown;
