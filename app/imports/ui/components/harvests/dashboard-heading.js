/**
 * @module ui/components/harvests/dashboard-heading
 */
import './dashboard-heading.jade';
import { Template } from 'meteor/templating';
import { Harvests } from '/imports/api/harvests/harvests.js';
import { Attempts } from '/imports/api/attempts/attempts.js';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveDict } from 'meteor/reactive-dict';
import { _ } from 'meteor/underscore';
import { pageState } from '../../pages/harvests/harvests.js';

/*****************************************************************************/
/* dashboardHeading: Helpers */
/*****************************************************************************/

Template.dashboardHeading.helpers({
  dataSources() {
    return Template.instance().state.get('harvests.count');
  },
  records() {
    return this.last_record_count;
  },
  attempts() {
    return 0;
  },
  errors() {
    return this.last_bad_count;
  }
});

/*****************************************************************************/
/* dashboardHeading: Lifecycle Hooks */
/*****************************************************************************/

/**
 * Creates a template state ReactiveDict and initializes harvests.count and
 * harvests.total_datasets both to null. It also calls harvests.count which
 * will asynchronously set the harvests.count key to the return value.
 *
 * @function dashboardHeading.onCreated
 * @name dashboardHeading.onCreated
 */
Template.dashboardHeading.onCreated(function() {
  this.state = new ReactiveDict();
  this.state.set('harvests.count', null);
  this.state.set('harvests.total_datasets', null);
  Meteor.call('harvests.count', (err, res) => {
    if(err) {
      console.error(err);
    } else {
      this.state.set('harvests.count', res);
    }
  });
});

/*****************************************************************************/
/* expandedDashboard: Event Handlers */
/*****************************************************************************/

Template.expandedDashboard.events({
  /**
   * Redirects the page to the records page with a query parameter to sort by errors.
   */
  'click #errors'(){
    if(!_.isUndefined(this._id)) {
      FlowRouter.go('records', {harvestId: this._id}, {"sort": "errors"});
    }
  },
  /**
   * Redirects the page to the records page.
   */
  'click #records'() {
    if(!_.isUndefined(this._id)) {
      FlowRouter.go('records', {harvestId: this._id});
    }
  },
  /**
   * Sets the pageState key editMode to true which causes the page to table to
   * resize and a second column to emerge which contains the pie chart.
   */
  'click button'(event) {
    event.preventDefault();
    event.stopPropagation();
    pageState.set('editMode', true);
    pageState.set('harvestId', null);
  }
});

/*****************************************************************************/
/* expandedDashboard: Lifecycle Hooks */
/*****************************************************************************/

Template.expandedDashboard.onRendered(function() {
  this.$('.showtip').tooltip();
});

/*****************************************************************************/
/* normalDashboard: Event Handlers */
/*****************************************************************************/

Template.normalDashboard.events({
  'click button'(event) {
    event.preventDefault();
    event.stopPropagation();
    pageState.set('editMode', true);
    pageState.set('harvestId', null);
  }
});

/*****************************************************************************/
/* normalDashboard: Helpers */
/*****************************************************************************/

Template.normalDashboard.helpers({
  totalDatasets() {
    let retval = Template.instance().state.get('harvests.total_datasets');
    return retval;
  }
});

/*****************************************************************************/
/* normalDashboard: Lifecycle Hooks */
/*****************************************************************************/

Template.normalDashboard.onCreated(function() {
  this.state = new ReactiveDict();
  this.state.set('harvests.total_datasets', null);
  Meteor.call('harvests.total_datasets', (err, res) => {
    if(err) {
      console.error(err);
    } else {
      this.state.set('harvests.total_datasets', res);
    }
  });
});

Template.normalDashboard.onRendered(function() {
  this.$('.showtip').tooltip();
});


