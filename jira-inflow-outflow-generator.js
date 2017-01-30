const _ = require('underscore');
const JiraApi = require('jira-client');

const render = require('./render');

const DAYS_AGO = 30;
const MS_PER_DAY = 1000 * 60 * 60 * 24;

const today = (() => {
    const now = new Date();
    return new Date(
        now.getFullYear(), now.getMonth(), now.getDate(),
        23, 59, 59, 999
    );
})();

class JiraInflowOutflowGenerator {
    constructor(options) {
        this._jira = new JiraApi(options);
    }

    renderPage(title, upToDaysAgo, inflowJql, outflowJql) {
        const inflowPromise = this._countItems(
            `${ inflowJql } AND createdDate > -${ daysAgo }d`,
            daysAgo,
            item => new Date(item.fields.created)
        );

        const outflowPromise = this._countItems(
            `${ outflowJql } AND resolutiondate > -${ daysAgo }d`,
            daysAgo,
            item => new Date(item.fields.resolutiondate)
        );

        return Promise.all([inflowPromise, outflowPromise])
            .then(([inflowCounts, outflowCounts]) => {

                const itemData = [
                    ['Date', 'Inflow', 'Outflow']
                ];

                for (const daysAgo of _.range(0, upToDaysAgo).reverse()) {
                    const date = new Date(today);
                    date.setDate(date.getDate() - daysAgo);

                    itemData.push(
                        [
                            date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                            inflowCounts[daysAgo],
                            outflowCounts[daysAgo]
                        ]
                    );
                }

                return render.inflowOutflow({
                    itemData,
                    title
                });
            });
    }

    _countItems(jql, daysAgo, getDate) {
        return this._jira.searchJira(
            jql,
            {
                // This makes no sense but works to get all the fields back...?
                properties: ['created'],
                maxResults: 1000
            }
        ).then(resp => {
            const itemCountByDaysAgo = new Array(daysAgo);
            itemCountByDaysAgo.fill(0);

            for (const item of resp.issues) {
                const date = getDate(item);

                const daysAgo = Math.floor((today - date) / MS_PER_DAY);

                itemCountByDaysAgo[daysAgo] += 1;

            }

            return itemCountByDaysAgo;
        });
    };
}

module.exports = JiraInflowOutflowGenerator;
