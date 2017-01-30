module.exports = (content) => `
    <html>
    <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
    <script>
        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(drawChart);

        function drawChart() {
            const data = google.visualization.arrayToDataTable(
                ${ JSON.stringify(content.itemData) }
            );

            const options = {
                hAxis: {
                    showTextEvery: 1,
                    slantedText: true,
                    slantedTextAngle: 45,
                    textStyle: {
                        fontSize: 10
                    },
                },
                legend: {
                    position: 'bottom',
                },
                title: '${ content.title }'
            };

            var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

            chart.draw(data, options);
        }
    </script>
    <body>

    <div id="curve_chart" style="width: 1000px; height: 700px"></div>

    </body>
    </html>
`;
