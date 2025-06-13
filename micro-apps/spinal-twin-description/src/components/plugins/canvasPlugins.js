export const customBackgroundPlugin = {
  id: "customCanvasBackgroundColor",
  beforeDraw: (chart, args, options) => {
    const { id, labelStep } = chart.config.options;
    if (!["bar-chart-id", "line-chart-id"].includes(id)) return;
    const { ctx, chartArea } = chart;
    ctx.save();
    ctx.lineWidth = 2;
    let begin = chartArea.left;
    const { top, height } = chartArea;
    const backPart =
      chart.config.type === "bar"
        ? chart.data.labels?.length
        : chart.data.labels?.length - 1;
    const decWidth = chartArea.width / (backPart || 1);
    ctx.fillStyle = options.color || "white";
    let width;
    switch (chart.config.type) {
      case "bar":
      case "line":
        chart.data.labels?.forEach((e, i) => {
          if (i === backPart || i % labelStep) return;
          if (i + labelStep > backPart) {
            width = decWidth * (backPart % labelStep);
          } else width = decWidth * labelStep;
          ctx.moveTo(begin + 5, top);

          ctx.lineTo(begin + width - 5, top);
          ctx.arcTo(begin + width, top, begin + width, top + 5, 15);

          ctx.lineTo(begin + width, top + height - 5);
          ctx.arcTo(
            begin + width,
            top + height,
            begin + width - 5,
            top + height,
            15
          );

          ctx.lineTo(begin + 5, top + height);
          ctx.arcTo(begin, top + height, begin, top + height - 5, 15);

          ctx.lineTo(begin, top + 5);
          ctx.arcTo(begin, top, begin + 5, top, 15);

          ctx.fill();
          ctx.strokeStyle = "#f9f9f9";
          ctx.stroke();
          begin += width;
        });
        break;

      case "pie":
        break;

      default:
        break;
    }
    ctx.restore();
  },
};

export const customLegendPlugin = {
  id: "htmlLegend",
  afterUpdate: (chart) => {
    switch (chart.config.type) {
      case "bar":
        if (chart.config.options.id === "bar-chart-id") {
          const legendContainer = document.querySelector(
            "#bar-legend-container"
          );
          const { chartArea } = chart;
          legendContainer.style.marginLeft = `${chartArea.left}px`;
          legendContainer.style.width = `${chartArea.width}px`;
          while (legendContainer?.firstChild)
            legendContainer.firstChild?.remove();
          const rightBox = document.createElement("div");
          const leftBox = document.createElement("div");
          [rightBox, leftBox].forEach((box) => {
            box.classList.add("d-flex", "flex-row");
          });

          const items = chart.config.data.datasets;
          const itemsBis =
            chart.options.plugins?.legend?.labels?.generateLabels(chart);

          const [leftIems, rightItems] = [[], []];
          items.forEach((i) => {
            if (i.type === "line") {
              const item = itemsBis.find((it) => it.text === i.label);
              item.fillStyle = item.strokeStyle;
              item.strokeStyle = "rgba(0,0,0,0)";
            }
            if (i.yAxisID === "y2")
              rightItems.push(itemsBis.find((it) => it.text === i.label));
            else leftIems.push(itemsBis.find((it) => it.text === i.label));
          });

          // left legend
          for (const item of leftIems) {
            const li = document.createElement("li");
            li.classList.add("d-flex", "flex-row", "mr-3");
            li.style.cursor = "pointer";
            li.style.color = item.fontColor;

            li.onclick = () => {
              chart.setDatasetVisibility(
                item.datasetIndex,
                !chart.isDatasetVisible(item.datasetIndex)
              );
              chart.update();
            };

            // Color box
            const boxSpan = document.createElement("span");
            boxSpan.classList.add("mr-2");
            boxSpan.style.background = item.fillStyle;
            boxSpan.style.height = "21px";
            boxSpan.style.width = "9px";
            boxSpan.style.border = item.strokeStyle;
            boxSpan.style.borderRadius = `${item.borderRadius}px`;

            // Text
            const textContainer = document.createElement("p");
            textContainer.classList.add("ma-0", "pa-0");
            textContainer.style.textDecoration = item.hidden
              ? "line-through"
              : "";
            textContainer.style.fontSize = "14px";

            const text = document.createTextNode(item.text);
            textContainer.appendChild(text);

            li.appendChild(boxSpan);
            li.appendChild(textContainer);
            leftBox.appendChild(li);
          }

          // right legend
          for (const item of rightItems) {
            const li = document.createElement("li");
            li.classList.add("d-flex", "flex-row", "ml-3");
            li.style.cursor = "pointer";
            li.style.color = item.fontColor;

            li.onclick = () => {
              chart.setDatasetVisibility(
                item.datasetIndex,
                !chart.isDatasetVisible(item.datasetIndex)
              );
              chart.update();
            };

            // Color box
            const boxSpan = document.createElement("span");
            boxSpan.classList.add("mr-2");
            boxSpan.style.background = item.fillStyle;
            boxSpan.style.height = "21px";
            boxSpan.style.width = "9px";
            boxSpan.style.border = item.strokeStyle;
            boxSpan.style.borderRadius = `${item.borderRadius}px`;

            // Text
            const textContainer = document.createElement("p");
            textContainer.classList.add("ma-0", "pa-0");
            textContainer.style.textDecoration = item.hidden
              ? "line-through"
              : "";
            textContainer.style.fontSize = "14px";

            const text = document.createTextNode(item.text);
            textContainer.appendChild(text);

            li.appendChild(boxSpan);
            li.appendChild(textContainer);
            rightBox.appendChild(li);
          }
          legendContainer?.appendChild(leftBox);
          legendContainer?.appendChild(rightBox);
        }
        break;
      case "line":
        if (chart.config.options.id === "line-chart-id") {
          chart.legend.left = chart.chartArea.left - 10;
          chart.legend.legendItems.forEach((b) => {
            b.fillStyle = b.strokeStyle;
            b.strokeStyle = "rgba(0,0,0,0)";
          });
        }
        break;
      case "pie":
      case "doughnut":
        if (chart.config.options.id === "pie-chart-id") {
          const legendContainer =
            chart.canvas.parentElement?.parentNode?.lastChild;
          while (legendContainer?.firstChild)
            legendContainer.firstChild?.remove();
          const items =
            chart.options.plugins?.legend?.labels?.generateLabels(chart);

          for (const item of items) {
            const li = document.createElement("li");
            li.classList.add("d-flex", "flex-row", "ma-3");
            li.style.cursor = "pointer";
            li.style.color = "#214353";

            li.onclick = () => {
              chart.toggleDataVisibility(item.index);
              chart.update();
            };

            // Color box
            const boxSpan = document.createElement("span");
            boxSpan.classList.add("mr-2");
            boxSpan.style.background = item.fillStyle;
            boxSpan.style.height = "21px";
            boxSpan.style.width = "9px";
            boxSpan.style.borderRadius = "5px";

            // Text
            const textContainer = document.createElement("p");
            textContainer.classList.add("ma-0", "pa-0");
            textContainer.style.textDecoration = item.hidden
              ? "line-through"
              : "";
            textContainer.style.fontSize = "14px";

            const text = document.createTextNode(item.text);
            textContainer.appendChild(text);

            li.appendChild(boxSpan);
            li.appendChild(textContainer);
            legendContainer?.appendChild(li);
          }
        }
        break;
      case "scatter":
      default:
        break;
    }
  },
};
