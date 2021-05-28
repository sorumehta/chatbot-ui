import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { checkIfCan } from '../../lib/scopes';

export const UserAccounts = new Mongo.Collection('user_accounts');


if (Meteor.isServer) {
    Meteor.publish('user_accounts', function() {
        // check(projectId, String);
        // if (!checkIfCan('stories:r', projectId, null, { backupPlan: true })) {
        //     return this.ready();
        // }
        // Slots.find({ projectId });
        return UserAccounts.find({  });
    });
}
