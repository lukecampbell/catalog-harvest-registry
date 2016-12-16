/**
 * @module api/harvests/harvests
 */
import { Mongo } from 'meteor/mongo';
import { Tabular } from 'meteor/aldeed:tabular';
import { moment } from 'meteor/momentjs:moment';
import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

/**
 * Harvests represent a regularly scheduled job to download XML documents from
 * a data provider. Each harvest has information about the organization it
 * belongs to, the location of the XML documents and metadata about the last
 * job that was run.
 *
 * This collection is published on `harvests.public`
 *
 * @public
 *
 * @property {string} name Name of the harvest
 * @property {string} url URL Location of the WAF where the XML documents exist
 * @property {string} organization Name of the organization. This should be an EXACT match to the name of an existing Organization's name attribute.
 * @property {Date} last_harvest_dt The date for when the last job ran.
 * @property {Number} harvest_interval The period in days for when to run the jobs.
 * @property {string} harvest_type The type of harvest
 * @property {Boolean} publish True if the harvest should be published to CKAN
 */
export const Harvests = new Mongo.Collection('Harvests');

export const HarvestsTable = new Tabular.Table({
  name: "Harvests",
  collection: Harvests,
  columns: [
    {
      title: "Name",
      data: "name"
    },
    {
      title: "Organization",
      data: "organization"
    },
    {
      title: "URL",
      data: "url",
      tmpl: Meteor.isClient && Template.harvestLink
    },
    {
      title: "Online",
      data: "publish",
      tmpl: Meteor.isClient && Template.harvestPublished
    },
    {
      title: "Records",
      data: "last_record_count"
    },
    {
      title: "CKAN Harvest URL",
      tmpl: Meteor.isClient && Template.harvestCKANLink
    },
    {
      title: "Last Harvest",
      data: "last_harvest_dt",
      render: function(val, type, doc) {
        if(val instanceof Date) {
          return moment(val).fromNow();
        }
        return val;
      }
    }
  ],
  extraFields: ['harvest_type', 'harvest_interval', 'last_good_count', 'last_bad_count']
});

const HarvestSchema = new SimpleSchema({
  _id: {
    type: String
  },
  name: {
    type: String
  },
  url: {
    type: String,
    unique: true,
    label: "URL"
  },
  organization: {
    type: String,
    label: "Organization"
  },
  /* harvest interval in seconds.  Initialize to null to indicate no harvest
   * made */
  last_harvest_dt: {
    type: Date,
    optional: true
  },
  harvest_interval: {
    type: Number,
    optional: true,
    defaultValue: 1
  },
  harvest_type: {
    type: String,
    allowedValues: ['WAF', 'ERDDAP-WAF', 'CSW'],
    defaultValue: 'WAF'
  },
  publish: {
    type: Boolean,
    defaultValue: false,
    label: "Publish this source?"
  }
});
Harvests.schema = HarvestSchema;

// add public Fields
Harvests.publicFields = {
  _id: 1,
  name: 1,
  url: 1,
  organization: 1,
  last_harvest_dt: 1,
  harvest_interval: 1,
  harvest_type: 1,
  publish: 1
};

Harvests.attachSchema(HarvestSchema);


if (Meteor.isClient) {
  Harvests.allow({
    insert(userId, doc) {
      return false;
    },

    update(userId, doc, fieldNames, modifier) {
      return false;
    },

    remove(userId, doc) {
      return false;
    }
  });

  Harvests.deny({
    insert(userId, doc) {
      return true;
    },

    update(userId, doc, fieldNames, modifier) {
      return true;
    },

    remove(userId, doc) {
      return true;
    }
  });
}
