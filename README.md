A little thing I made to graph bug inflow/outflow for Jira. It looks kinda gross but it works.

# How it works

Inflow is determined by `createdDate` in the JQL. Outflow is determined via `resolutiondate`.

# Bugs

* Timezones might still be a little weird.
* I'm not sure that Jira resets resolutiondata if an item transitions from a resolved state to a non-closed state.

#Example usage:

```
const express = require('express');

const JiraInflowOutflowGenerator = require('jira-inflow-outflow-generator');

const DAYS_AGO = 30;

const flowGenerator = new JiraInflowOutflowGenerator({
    protocol: 'https',
    host: '<your account>.atlassian.net',
    username: 'username',
    password: 'password',
    apiVersion: '2',
    strictSSL: true
});

const app = express();

app.get('/', (req, res) => {

    flowGenerator.renderPage(
        'Bug inflow/outflow for project POOP',
        DAYS_AGO,
        `issuetype = Bug AND project = 'POOP'`,
        `issuetype = Bug AND project = 'POOP' and status = Closed`
    ).then(renderedPage => {
        res.send(renderedPage);
    });

});

app.listen(3000, function () {
    console.log('Listening on port 3000!');
});



```

