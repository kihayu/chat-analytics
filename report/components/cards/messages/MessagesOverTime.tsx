import { useCallback } from "react";

import { Color, Tooltip } from "@amcharts/amcharts5";
import {
    AxisRendererX,
    AxisRendererY,
    ColumnSeries,
    DateAxis,
    StepLineSeries,
    ValueAxis,
    XYChart,
    XYCursor,
} from "@amcharts/amcharts5/xy";
import { MessagesPerCycle } from "@pipeline/aggregate/blocks/messages/MessagesPerCycle";
import { createYAxisLabel, syncAxisWithTimeFilter } from "@report/components/viz/amcharts/AmCharts5";
import { AmCharts5Chart, CreateFn } from "@report/components/viz/amcharts/AmCharts5Chart";

export const MessagesOverTime = ({ data, options }: { data?: MessagesPerCycle; options: number[] }) => {
    const createMessagesChart = useCallback<CreateFn<MessagesPerCycle>>(
        (c) => {
            const period = ["day", "week", "month"][options[0]] as "day" | "week" | "month";

            const chart = c.children.push(
                XYChart.new(c.root, {
                    layout: c.root.verticalLayout,
                })
            );

            const cursor = chart.set("cursor", XYCursor.new(c.root, {}));
            cursor.lineX.set("visible", false);
            cursor.lineY.set("visible", false);

            const xAxis = chart.xAxes.push(
                DateAxis.new(c.root, {
                    baseInterval: { timeUnit: period, count: 1 },
                    renderer: AxisRendererX.new(c.root, {}),
                })
            );
            const yAxis = chart.yAxes.push(
                ValueAxis.new(c.root, {
                    renderer: AxisRendererY.new(c.root, {}),
                    maxPrecision: 0, // messages are integers
                    min: 0, // always base at 0
                })
            );
            createYAxisLabel(yAxis, "Messages sent");

            const tooltip = Tooltip.new(c.root, {
                labelText: {
                    day: "[bold]{valueX.formatDate('dd MMM yyyy')}[/]: {valueY} messages sent",
                    week: "[bold]A week of {valueX.formatDate('MMM yyyy')}[/]: {valueY} messages sent",
                    month: "[bold]{valueX.formatDate('MMM yyyy')}[/]: {valueY} messages sent",
                }[period],
            });

            const graphType = period === "day" ? "step" : "column";

            let series: ColumnSeries | StepLineSeries;

            // for days
            if (graphType === "step") {
                series = StepLineSeries.new(c.root, {
                    valueXField: "d",
                    valueYField: "m",
                    xAxis: xAxis,
                    yAxis: yAxis,
                    noRisers: true,
                    stroke: Color.fromHex(0x57b1ff),
                    fill: Color.fromHex(0x57b1ff),
                    tooltip,
                });
                series.strokes.template.setAll({
                    visible: true,
                    strokeWidth: 2,
                    strokeOpacity: 0.8,
                });
                series.fills.template.setAll({
                    visible: true,
                    fillOpacity: 0.2,
                });
            } else {
                // for weeks and months
                series = ColumnSeries.new(c.root, {
                    valueXField: "d",
                    valueYField: "m",
                    xAxis: xAxis,
                    yAxis: yAxis,
                    fill: Color.fromHex(0x479adb),
                    tooltip,
                });
            }

            chart.series.push(series);

            const setData = (data: MessagesPerCycle) => {
                series.data.setAll(
                    {
                        day: data.perDay,
                        week: data.perWeek,
                        month: data.perMonth,
                    }[period]
                );
                return chart;
            };

            const cleanupAxisSync = syncAxisWithTimeFilter([series], xAxis, yAxis);
            // since we are syncing the axis, we don't want the zoom out button
            chart.zoomOutButton.set("forceHidden", true);

            return [setData, cleanupAxisSync];
        },
        [options[0]]
    );

    return (
        <AmCharts5Chart
            data={data}
            create={createMessagesChart}
            style={{
                minHeight: 550,
                marginLeft: 5,
                marginBottom: 8,
            }}
        />
    );
};
