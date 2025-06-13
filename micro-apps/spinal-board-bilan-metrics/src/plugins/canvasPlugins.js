import { Chart, ChartOptions } from "chart.js";

export const customBackgroundPlugin = {
  id: "customCanvasBackgroundColor",
  beforeDraw: (chart, args, options) => {
    const { ctx, chartArea } = chart;
    ctx.save();
    ctx.lineWidth = 2;
    let begin = chartArea.left;
    const { top, height } = chartArea;
    let width;
    switch (chart.config.type) {
      case "bar":
        width = chartArea.width / (chart.data.labels?.length || 1);
        ctx.fillStyle = '#fff';
        chart.data.labels?.forEach(() => {
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
        case "line":
          width = chartArea.width / (chart.data.labels?.length || 1);
          ctx.fillStyle = '#fff';
          chart.data.labels?.forEach(() => {
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
  afterUpdate: (chart, args, options) => {
    if ((chart.config.type === "bar" && chart.legend) || (chart.config.type === "line" && chart.legend)) {
      chart.legend.left = chart.chartArea.left + 40;
      chart.legend.legendHitBoxes = chart.legend.legendHitBoxes.map(lhb => {lhb.left += 120; return lhb});
    } else if (chart.config.type === "pie") {
      const legendContainer = chart.canvas.parentElement?.parentNode?.lastChild;
      while (legendContainer?.firstChild) legendContainer.firstChild?.remove();
      const items =
        chart.options.plugins?.legend?.labels?.generateLabels(chart);

      for (const item of items) {
        const li = document.createElement("li");
        li.classList.add("d-flex", "flex-row");
        li.style.color = "#000000DE";
        li.style.maxWidth = "calc(50vw - 330px)";
        li.style.width = "100%";
        li.style.display = "flex";
        li.style.alignItems = "center";

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
        boxSpan.style.cursor = "pointer";


        // Text
        const textContainer = document.createElement("p");
        textContainer.classList.add("ma-0", "pa-0");
        textContainer.style.textDecoration = item.hidden ? "line-through" : "";
        textContainer.style.fontSize = "14px";
        /*
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        */
        textContainer.style.width = "100%";
        textContainer.style.whiteSpace = "nowrap";
        textContainer.style.overflow = "hidden";
        textContainer.style.textOverflow = "ellipsis";
        textContainer.style.display = "flex";
        textContainer.style.alignItems = "center";
        textContainer.style.cursor = "pointer";

       

        const text = document.createTextNode(item.text);
        textContainer.appendChild(text);

        li.appendChild(boxSpan);
        li.appendChild(textContainer);
        legendContainer?.appendChild(li);
      }
    }
  },
};
