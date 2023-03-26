/**
 * HealthController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  health: function (req, res) {
    return res.ok({ status: 'Made by Alcoholics for Alcoholics' });
  }

};