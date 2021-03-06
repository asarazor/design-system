/**
 * A "page" is generated from a top-level KSS comment block (ie. one that
 * doesn't have a parent reference), or a Markdown file.
 */
import PageBlock from './PageBlock';
import PageHeader from './PageHeader';
import PropTypes from 'prop-types';
import React from 'react';
/* eslint-disable sort-imports */
import { Tabs, TabPanel } from '@cmsgov/design-system-core';

function isGuidanceSection(section) {
  return Boolean(section.reference.match(/\.guidance([a-z-_]+)?$/i));
}

class Page extends React.PureComponent {
  constructor(props) {
    super(props);
    this.hasTabs = (this.props.sections.length && this.props.depth >= 2);
    this.horizontalPadding = {
      default: 3,
      sm: 6
    };
    this.tabPanelClasses = `ds-u-border--0 ds-u-padding-x--${this.horizontalPadding.default} ds-u-sm-padding-x--${this.horizontalPadding.sm} ds-u-padding-y--0`;
  }

  defaultSelectedTabId() {
    if (this.guidanceSections().length &&
      typeof window !== 'undefined' &&
      window.location.hash === '#guidance') {
      return 'guidance';
    }

    return 'usage';
  }

  usageSections() {
    return this.props.sections.filter(s => !isGuidanceSection(s));
  }

  guidanceSections() {
    return this.props.sections.filter(isGuidanceSection);
  }

  renderChildPageBlocks(sections) {
    if (sections) {
      return sections.map(section => (
        <PageBlock key={section.referenceURI} {...section} />
      ));
    }
  }

  renderBody() {
    return <PageBlock {...this.props} hideHeader />;
  }

  renderContent() {
    if (this.hasTabs) {
      return (
        <Tabs
          defaultSelectedId={this.defaultSelectedTabId()}
          tablistClassName='ds-u-padding-left--3 ds-u-sm-padding-left--6 ds-u-fill--gray-lightest'
        >
          <TabPanel
            className={this.tabPanelClasses}
            id='usage'
            tab='Usage'
          >
            {this.renderBody()}
            {this.renderChildPageBlocks(this.usageSections())}
          </TabPanel>
          {this.renderGuidanceTabPanel()}
        </Tabs>
      );
    }

    return (
      <div className={`ds-u-border-top--1 ds-u-padding-x--${this.horizontalPadding.default} ds-u-sm-padding-x--${this.horizontalPadding.sm}`}>
        {this.renderBody()}
      </div>
    );
  }

  renderGuidanceTabPanel() {
    const sections = this.guidanceSections();

    if (sections.length) {
      return (
        <TabPanel
          className={this.tabPanelClasses}
          id='guidance'
          tab='Guidance'
        >
          {this.renderChildPageBlocks(sections)}
        </TabPanel>
      );
    }
  }

  render() {
    return (
      <div>
        <PageHeader {...this.props} />
        {this.renderContent()}
      </div>
    );
  }
}

Page.defaultProps = {
  depth: 0,
  sections: []
};

Page.propTypes = {
  depth: PropTypes.number,
  sections: PropTypes.arrayOf(
    PropTypes.shape(PageBlock.propTypes)
  )
};

export default Page;
