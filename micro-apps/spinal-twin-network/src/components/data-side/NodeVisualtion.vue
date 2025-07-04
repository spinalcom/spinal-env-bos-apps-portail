<!--
Copyright 2024 SpinalCom - www.spinalcom.com

This file is part of SpinalCore.

Please read all of the following terms and conditions
of the Free Software license Agreement ("Agreement")
carefully.

This Agreement is a legally binding contract between
the Licensee (as defined below) and SpinalCom that
sets forth the terms and conditions that govern your
use of the Program. By installing and/or using the
Program, you agree to abide by all the terms and
conditions stated or referenced herein.

If you do not agree to abide by these terms and
conditions, do not demonstrate your acceptance and do
not install or use the Program.
You should have received a copy of the license along
with this file. If not, see
<http://resources.spinalcom.com/licenses.pdf>.
-->
<template>
  <div ref="container" class="graph-container">
    <div class="chart-title-container">
      <div class="header-title">Représentation Visuelle du réseau</div>
      <div style="
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
        ">
        <!-- <div
          title="Télecharger"
          class="download-all-button"
          v-if="allOpened"
          @click="downloadDivAsPDF"
        ></div> -->
        <!-- <div title="Afficher tout le reseau" v-if="!allOpened" class="show-all-button" @click="openAll()">
          Tout afficher
        </div>
        <div title="Fermer tout le reseau" v-if="allOpened" class="show-all-button" @click="closeAll()">
          Réduire
        </div> -->
      </div>
    </div>
    <div style="background-color: #14202c; width: 100%; height: 1px; opacity: 0.2"></div>
    <div class="svg-container" id="svg-container">
      <svg width="1000" height="1000"></svg>
    </div>
    <div class="chart-buttons">
      <div class="chart-buttons-toggle">
        <div v-tooltip="{ content: isVertical ? 'Vue verticale' : 'Vue horizontale', placement: 'right' }"
          title="Vue Vertical" class="toggle-container">
          <input type="checkbox" id="toggle-switch" class="toggle-switch" @change="changeDirection" />
          <label for="toggle-switch" class="toggle-label"></label>
        </div>
      </div>
      <div v-tooltip="{ content: !allOpened ? 'Afficher tout' : 'Fermer tout', placement: 'right' }"
        class="chart-buttons-button" @click="allOpened ? closeAll() : openAll()" :class="{
          'show-all-icon': !allOpened,
          'hide-all-icon': allOpened,
        }"></div>
      <div v-tooltip="{ content: !isFullscreen ? 'Plein écran' : 'Réduire', placement: 'right' }"
        class="chart-buttons-button" @click="toggleFullView" :class="{
          'half-screen': isFullscreen,
          'full-screen': !isFullscreen,
        }">

      </div>
    </div>


    <div class="legend-container">
      <LegendVue :listItem="legendSpaceAssignation"></LegendVue>
    </div>
    <div v-if="tooltip" class="tooltip" :style="{
      top: tooltipPosition.top + 'px',
      left: tooltipPosition.left + 'px',
    }">
      <p>{{ tooltip.name }}</p>
      <p>Noeud Id: {{ tooltip.id }}</p>
      <p>Status: {{ tooltip.status }}</p>
      <p>Children: {{ tooltip.children }}</p>
      <p>Self Status: {{ tooltip.selfstatus }}</p>
      <p>Type: {{ tooltip.type }}</p>
      <div id="tailShadow"></div>
      <div id="tail1"></div>
      <div id="tail2"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Prop, Vue, Watch } from "vue-property-decorator";
import Component from "vue-class-component";
import * as d3 from "d3";
import { EventBus } from "./EventBus";
// import { Legend } from "./interfaces/ILegend";
import { Legend } from "../../interfaces/ILegend";
import LegendVue from "./Legend.vue";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import VTooltip from 'v-tooltip';
import { IConfig } from "../../interfaces/IConfig";

interface TransformedNode {
  id: number;
  dynamicId: number;
  parentId: number | null;
  x: number;
  y: number;
  status: string;
  self_status?: string;
  name?: string;
  type?: string;
  children?: TransformedNode[];
  typologie?: string;
  position?: THREE.Vector3;
}

@Component({
  name: "NodeVisualization",
  components: {
    LegendVue,
  },
})
class NodeVisualization extends Vue {
  @Prop() dataprop: any[];
  @Prop() isActive!: boolean;
  @Prop() config: IConfig;
  Nodeto: any[] = [];
  displayedNodes: TransformedNode[] = [];
  expandedNodes: Set<number> = new Set(); // Track expanded nodes
  transformedNodesGeneric: TransformedNode[] = [];
  isVertical = false;
  allOpened = false;

  lastClickedNodeId: number | null = null;
  tooltip: {
    id: number;
    status: string;
    selfstatus: string;
    name: string;
    children: number;
    type: string;
  } | null = null; // Add tooltip state
  tooltipPosition = { top: 0, left: 0 };
  legendSpaceAssignation: Legend[] = [
    {
      title: "Equipement Actif",
      color: "#325e4b",
      type: "Not-assigned",
    },
    {
      title: "Equipement Inactif",
      color: "#d7270c",
      type: "Assigned",
    },
    {
      title: "Equipement Inconnu",
      color: "#f49700",
      type: "AssignedToAnother",
    },
  ];

  dataImageUrl: string = "";
  isFullscreen: boolean = false;

  toggleFullView() {
    this.isFullscreen = !this.isFullscreen;
    this.$emit("toggle-full-view");
  }
  toggleFullViewOff() {
    if (this.isFullscreen) {
      this.isFullscreen = false;
      this.$emit("toggle-full-view");
    }
  }
  @Watch('isActive')
  onIsActiveChange(newValue: boolean) {
    if (newValue) {
      this.scrollToNode(this.lastClickedNodeId || this.displayedNodes[0]?.id);
    }
  }
  mounted() {
    this.Nodeto = this.$store.state.appDataStore.selectedEquipements;

    this.transformedNodesGeneric = this.transformData(this.dataprop);
    this.displayedNodes = this.getPrincipalNodes(this.transformedNodesGeneric);
    this.createChart(this.displayedNodes, this.isVertical);
    this.$on('buttonClicked3D', () => {
      this.isFullscreen = false;
    });
    EventBus.$on("on-node-click", this.onNodeClickOut);
    EventBus.$on("deactivate-fullscreen", this.toggleFullViewOff);
  }

  beforeDestroy() {
    EventBus.$off("on-node-click", this.onNodeClickOut);
    EventBus.$off("deactivate-fullscreen", this.toggleFullViewOff);
  }

  openAll() {
    this.allOpened = true;
    this.transformedNodesGeneric = this.showAllGraph(this.dataprop);
    this.displayedNodes = this.getPrincipalNodes(this.transformedNodesGeneric);
    this.createChart(this.transformedNodesGeneric, this.isVertical);
  }
  closeAll() {
    this.allOpened = false;
    this.transformedNodesGeneric = this.transformData(this.dataprop);
    this.displayedNodes = this.getPrincipalNodes(this.transformedNodesGeneric);
    this.createChart(this.displayedNodes, this.isVertical);
  }

  // Function to download the div as a PDF
  downloadDivAsPDF() {
    // Getting the div which is to be downloaded as PDF
    const svgContainer = document.getElementById("svg-container");
    let divContents;
    if (svgContainer) {
      divContents = svgContainer.innerHTML;
    } else {
      console.error("Element with ID 'svg-container' was not found.");
      return;
    }
    // Use jsPDF to creade a PDF
    // const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    // Convert the div contents to a PDF using the built-in HTML renderer
    pdf.html(svgContainer, {
      callback: function (doc) {
        // Save the PDF
        doc.save('svg-container.pdf');
      },
      // x: 10,
      // y: 10,
      // width: 700, // set width if necessary
    });
  }


  // Function to change the direction of the graph horizontally or vertically
  changeDirection(event: Event) {
    this.isVertical = (event.target as HTMLInputElement).checked;
    if (this.isVertical) {
      this.transformedNodesGeneric = this.transformDataVertical(this.dataprop);
    } else {
      this.transformedNodesGeneric = this.transformData(this.dataprop);
    }
    this.displayedNodes = this.getPrincipalNodes(this.transformedNodesGeneric);
    this.createChart(this.displayedNodes, this.isVertical);
  }

  @Watch("isVertical")
  onSelectedDynamicIdChange(newVal: number) {
    this.createChart(this.displayedNodes, this.isVertical);
  }

  // Function to create the chart using D3.js
  async createChart(transformDataent: TransformedNode[], isVertical) {
    const svg = d3.select(this.$refs.container).select("svg");
    const width = +svg.attr("width");
    const height = +svg.attr("height");
    const parentColor = "#0a1045";
    const childColor = "#00c2d1";
    svg.selectAll("*").remove();
    const defs = svg.append("defs");

    svg
      .append("defs")
      .append("filter")
      .attr("id", "shadow")
      .append("feDropShadow")
      .attr("dx", 3)
      .attr("dy", 3)
      .attr("stdDeviation", 3)
      .attr("fill", "blue");

    const simulation = d3
      .forceSimulation(transformDataent || [])
      .force(
        "link",
        d3.forceLink().id((d: any) => d.id)
      )
      .force(
        "x",
        d3
          .forceX()
          .strength(0.1)
          .x((d: any) => d.x)
      )
      .force(
        "y",
        d3
          .forceY()
          .strength(0.1)
          .y((d: any) => d.y)
      )
      .on("tick", ticked);

    const links = transformDataent
      .filter((d) => d.parentId !== null)
      .map((d) => ({
        source: transformDataent.find((p) => p.id === d.parentId),
        target: d,
      }));

    const link = svg
      .append("g")
      .attr("class", "links")
      .selectAll("path")
      .data(links)
      .enter()
      .append("path")
      .attr("d", (d: any) => (isVertical ? linkPath2(d) : linkPath(d)))
      .attr("stroke", (d: any) =>
        getLinkColor(d.source.status, d.target.status)
      )
      .attr("stroke-width", 2)
      .attr("fill", "none");

    const node = svg
      .append("g")
      .attr("class", "nodes")
      .selectAll("foreignObject")
      .data(transformDataent)
      .enter()
      .append("foreignObject")
      .attr("width", 160)
      .attr("height", 60)
      .attr("x", (d) => d.x - 80)
      .attr("y", (d) => d.y - 30)
      .attr("data-node-id", (d) => d.id)
      .style("overflow", "visible")
      .on("mouseover", (event, d) => {
        const nodeBoundingRect = event.currentTarget.getBoundingClientRect();
        const tooltipWidth = 150;
        const tooltipHeight = 60;

        let tooltipX =
          nodeBoundingRect.left +
          nodeBoundingRect.width / 2 -
          tooltipWidth / 2 +
          110;
        let tooltipY = nodeBoundingRect.top - tooltipHeight - 10;

        this.tooltip = {
          id: d.id,
          status: d.status,
          selfstatus: d.self_status,
          name: d.name,
          children: d.children != null ? d.children.length : 0,
          type: d.type,
        };
        this.tooltipPosition = { top: tooltipY, left: tooltipX };
      })
      .on("mouseout", () => {
        this.tooltip = null;
      })
      .on("click", (event, d) => {
        this.onNodeClick(d.id);

        d.fx = null;
        d.fy = null;
        simulation.nodes(transformDataent);
        simulation.alpha(1).restart();
      });

    const nodeDiv = node
      .append("xhtml:div")
      .style("width", "160px")
      .style("height", "60px")
      .style("display", "flex")
      .style("align-items", "center")
      .style("border-radius", "5px")
      .style("background-color", "white")
      .style("border", (d) => `2px solid ${getNodeBorderColor(d.status)}`)
      .style("box-shadow", (d) =>
        d.id === this.lastClickedNodeId ? "0px 0px 10px 1px blue" : "none"
      )
      .style("padding", "10px 3px");

    nodeDiv
      .append("div")
      .style("width", "20%")
      .style("height", "60%")
      .style(
        "background-image",
        (d) =>
          `url(${this.config.imageMapping[d.typologie] || this.config.imageMapping.Default})`
      )
      .style("background-size", "contain")
      .style("background-position", "center");

    const infoDiv = nodeDiv
      .append("div")
      .style("width", "70%")
      .style("padding", "5px");

    infoDiv
      .append("div")
      .style("font-size", "0.7rem")
      .style("line-height", "1.2")
      .text((d) =>
        d.name.length > 40 ? d.name.substring(0, 40) + "..." : d.name
      );

    infoDiv
      .append("div")
      .style("font-size", "0.6rem")
      .style("color", (d) => `${getNodeBorderColor(d.status)}`)
      .style("font-weight", "bold")
      .text((d) => d.status);

    const label = svg
      .append("g")
      .attr("class", "labels")
      .selectAll("text")
      .data(transformDataent)
      .enter()
      .append("text")
      .attr("dy", -10)
      .attr("dx", 10)
      .attr("fill", "grey")
      .text((d: any) => d.id);

    function ticked() {
      link.attr("d", (d: any) => (isVertical ? linkPath2(d) : linkPath(d)));
      node.attr("x", (d) => d.x - 80).attr("y", (d) => d.y - 30);
    }

    adjustSvgSize(svg, node);

    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    function adjustSvgSize(svg, node) {
      const nodes = node.nodes();
      let minX = Infinity,
        minY = Infinity,
        maxX = -Infinity,
        maxY = -Infinity;

      nodes.forEach((n) => {
        const nodeX = +n.getAttribute("x");
        const nodeY = +n.getAttribute("y");
        const nodeWidth = 200; // Width of each node
        const nodeHeight = 60; // Height of each node

        // Adjust min and max based on node position and size
        if (nodeX < minX) minX = nodeX;
        if (nodeY < minY) minY = nodeY;
        if (nodeX + nodeWidth > maxX) maxX = nodeX + nodeWidth;
        if (nodeY + nodeHeight > maxY) maxY = nodeY + nodeHeight;

        // Check if node has expanded children (adjust maxY accordingly)
        const expandedChildrenHeight = 100; // Example height of expanded children
        // Adjust maxY if expandedChildrenHeight is greater than nodeHeight
        if (expandedChildrenHeight > nodeHeight) {
          if (nodeY + expandedChildrenHeight > maxY) {
            maxY = nodeY + expandedChildrenHeight;
          }
        }
      });

      const padding = 20;
      const width = maxX - minX + padding * 2 + 160;
      const height = maxY - minY + padding * 2 + 100;

      svg.attr("width", width).attr("height", height);
    }

    function linkPath(d: any) {
      const sourceX = d.source.x + 80; // Right edge of the parent node
      const sourceY = d.source.y;
      const targetX = d.target.x - 80; // Left edge of the child node
      const targetY = d.target.y;
      return `M${sourceX},${sourceY} C${sourceX + 50},${sourceY} ${targetX - 50
        },${targetY} ${targetX},${targetY}`;
    }

    function linkPath2(d: any) {
      const sourceX = d.source.x; // Right edge of the parent node
      const sourceY = d.source.y + 25; // Bottom edge of the parent node
      const targetX = d.target.x; // Left edge of the child node
      const targetY = d.target.y - 25; // Top edge of the child node
      return `M${sourceX},${sourceY} C${sourceX},${sourceY + 70} ${targetX},${targetY - 70
        } ${targetX},${targetY}`;
    }

    function getNodeBorderColor(status: string): string {
      switch (status) {
        case "active":
          return "#325e4b";
        case "inactive":
          return "#d7270c";
        case "unknown":
          return "#f49700";
        default:
          return "transparent";
      }
    }

    function getLinkColor(sourceStatus: string, targetStatus: string): string {
      if (targetStatus === "active") {
        return "#325e4b";
      }
      if (targetStatus === "inactive") {
        return "#d7270c";
      }
      if (sourceStatus === "unknown") {
        return "#f49700";
      }
      return "gray";
    }
  }

  // Function to transform the data into a format suitable for D3.js
  transformData(
    nodes: Node[],
    parentId: number | null = null,
    x: number = 150,
    y: number = 80,
    depth: number = 0
  ): TransformedNode[] {
    const transformedNodes: TransformedNode[] = [];
    const yIncrement = 80;
    // Helper function to recursively add nodes
    const addNodes = (
      nodes: Node[],
      parentId: number | null,
      x: number,
      y: number,
      depth: number
    ) => {
      nodes.forEach((node, index) => {
        const nodeY = y + index * yIncrement;

        const nodeX = x + depth * yIncrement;

        const transformedNode: TransformedNode = {
          id: node.dynamicId,
          dynamicId: node.dynamicId,
          parentId: parentId,
          x: nodeX,
          y: nodeY,
          status: node.status,
          self_status: node.self_status,
          name: node.name,
          type: node.type,
          children: node.nodes,
          typologie: node.typologie,
          position: node.position,
        };

        transformedNodes.push(transformedNode);
        if (node.nodes && node.nodes.length > 0) {
          // Calculate the starting y position for children to be centered around the parent node
          const childYStart =
            nodeY - ((node.nodes.length - 1) * yIncrement) / 2;
          addNodes(node.nodes, node.dynamicId, x + 200, childYStart, depth + 1);
        }
      });
    };

    addNodes(nodes, parentId, x, y, depth);
    this.adjustY(transformedNodes);

    return transformedNodes;
  }

  // Function to open all nodes in the graph
  showAllGraph(
    nodes: Node[],
    parentId: number | null = null,
    x: number = 150,
    y: number = 80,
    depth: number = 0
  ): TransformedNode[] {
    const transformedNodes: TransformedNode[] = [];
    const yIncrement = 80;
    const xIncrement = 250;

    // Helper function to calculate the total height required by a node's subtree
    const calculateSubtreeHeight = (nodes: Node[]): number => {
      if (!nodes || nodes.length === 0) return yIncrement;
      return nodes.reduce((total, node) => {
        return total + calculateSubtreeHeight(node.nodes || []);
      }, 0);
    };

    // Helper function to recursively add nodes
    const addNodes = (
      nodes: Node[],
      parentId: number | null,
      x: number,
      y: number,
      depth: number
    ) => {
      let currentY = y;

      nodes.forEach((node) => {
        const subtreeHeight = calculateSubtreeHeight(node.nodes || []);
        const nodeY = currentY + subtreeHeight / 2 - yIncrement / 2;

        const transformedNode: TransformedNode = {
          id: node.dynamicId,
          dynamicId: node.dynamicId,
          parentId: parentId,
          x: x,
          y: nodeY,
          status: node.status,
          self_status: node.self_status,
          name: node.name,
          type: node.type,
          children: node.nodes,
          typologie: node.typologie,
          position: node.position,
        };

        transformedNodes.push(transformedNode);

        if (node.nodes && node.nodes.length > 0) {
          addNodes(
            node.nodes,
            node.dynamicId,
            x + xIncrement,
            currentY,
            depth + 1
          );
        }

        currentY += subtreeHeight;
      });
    };

    addNodes(nodes, parentId, x, y, depth);

    return transformedNodes;
  }

  // Adjust the y positions of nodes to ensure they are not too close to the top or left edges
  adjustY(nodes) {
    const idMap = {};
    nodes.forEach((node) => {
      idMap[node.id] = node;
    });

    nodes.forEach((node) => {
      if (node.y < 80) {
        let siblings = nodes
          .filter((n) => n.parentId === node.parentId)
          .sort((a, b) => a.y - b.y);
        let y = 80;
        siblings.forEach((sibling) => {
          sibling.y = y;
          y += 80;
        });
      }
    });
  }
  // Adjust the x positions of nodes to ensure they are not too close to the left edge
  adjustX(nodes) {
    const idMap = {};
    nodes.forEach((node) => {
      idMap[node.id] = node;
    });

    nodes.forEach((node) => {
      if (node.x < 150) {
        let siblings = nodes
          .filter((n) => n.parentId === node.parentId)
          .sort((a, b) => a.x - b.x);
        let x = 150;
        siblings.forEach((sibling) => {
          sibling.x = x;
          x += 200;
        });
      }
    });
  }

  // Function to transform the data into a format suitable for D3.js (vertical layout positioning)
  transformDataVertical(
    nodes: Node[],
    parentId: number | null = null,
    x: number = 150,
    y: number = 80,
    depth: number = 0
  ): TransformedNode[] {
    const transformedNodes: TransformedNode[] = [];
    const xIncrement = 200;
    const yIncrement = 50;

    // Helper function to recursively add nodes
    const addNodes = (
      nodes: Node[],
      parentId: number | null,
      x: number,
      y: number,
      depth: number
    ) => {
      nodes.forEach((node, index) => {
        const nodeX = x + index * xIncrement;
        const nodeY = y + depth * yIncrement;

        const transformedNode: TransformedNode = {
          id: node.dynamicId,
          dynamicId: node.dynamicId,
          parentId: parentId,
          x: nodeX,
          y: nodeY,
          status: node.status,
          self_status: node.self_status,
          name: node.name,
          type: node.type,
          children: node.nodes,
          typologie: node.typologie,
          position: node.position,
        };

        transformedNodes.push(transformedNode);

        if (node.nodes && node.nodes.length > 0) {
          // Calculate the starting x position for children to be centered around the parent node
          const childXStart =
            nodeX - ((node.nodes.length - 1) * xIncrement) / 2;
          addNodes(node.nodes, node.dynamicId, childXStart, y + 100, depth + 1);
        }
      });
    };

    addNodes(nodes, parentId, x, y, depth);
    this.adjustX(transformedNodes);
    return transformedNodes;
  }

  // Function to get the principal nodes (nodes with no parent)
  getPrincipalNodes(transformedData: TransformedNode[]): TransformedNode[] {
    const returneddata = transformedData.filter(
      (node) => node.parentId === null
    );
    return returneddata;
  }

  //get node by node id
  getNodeById(id: number): TransformedNode | undefined {
    return this.transformedNodesGeneric.find((node) => node.id === id);
  }

  // Function to find a node and its parent by dynamicId for click events outside the component
  findNodeAndParent(nodes, targetDynamicId) {
    // This function will traverse the nodes and return the node and its parent
    let parent = null;
    let targetNode = null;

    function traverse(currentNodes, parentNode) {
      for (const node of currentNodes) {
        if (node.dynamicId === targetDynamicId) {
          parent = parentNode;
          targetNode = node;
          return true;
        }
        if (node.nodes && traverse(node.nodes, node)) {
          return true;
        }
      }
      return false;
    }

    traverse(nodes, null);
    return { targetNode, parent };
  }

  // Function to get siblings of a node by dynamicId
  getSiblings(nodes, targetDynamicId) {
    const { targetNode, parent } = this.findNodeAndParent(
      nodes,
      targetDynamicId
    );

    if (!targetNode || !parent) {
      // If the node or its parent is not found, return an empty array
      return [];
    }

    // Return all children of the parent except the target node
    return parent.nodes.filter((node) => node.dynamicId !== targetDynamicId);
  }

  // Function to handle node click events in the 3djs graph
  onNodeClick(nodeId: number) {
    const node = this.getNodeById(nodeId);

    if (!node) {
      console.error(`Node with ID ${nodeId} not found.`);
      return;
    }

    // console.log("Transformed data", this.transformedNodesGeneric, "Node", node);

    if (this.lastClickedNodeId !== null) {
      d3.select(`[data-node-id='${this.lastClickedNodeId}']`).classed(
        "node-shadow",
        false
      );
      // console.log(
      //   "Node clicked",
      //   node.id,
      //   "last clicked",
      //   this.lastClickedNodeId
      // );
    }
    this.lastClickedNodeId = node.id;
    d3.select(`[data-node-id='${node.id}']`).classed("node-shadow", true);
    // console.log(
    //   "Node clicked",
    //   node.id,
    //   "last clicked",
    //   this.lastClickedNodeId
    // );
    if (this.expandedNodes.has(node.id)) {
      //closing opened node
      this.collapseNodeAndDescendants(node.id);
      this.expandedNodes.delete(node.id);
      // EventBus.$emit("deselect-all", node.id);
      // EventBus.$emit("toggle-children", node.id);

      EventBus.$emit("table-node-click", node, 1);
    } else {
      if (node.parentId !== null && !this.expandedNodes.has(node.parentId)) {
        //impossible case
        this.displayedNodes = this.displayedNodes.filter(
          (n) => n.parentId !== node.id
        );
        this.expandedNodes.delete(node.id);
        // EventBus.$emit("deselect-all", node.id);
        // EventBus.$emit("toggle-children", node.id);
        EventBus.$emit("table-node-click", node, 1);
      } else if (node.parentId === null) {
        this.displayedNodes = this.getPrincipalNodes(
          this.transformedNodesGeneric
        );
        this.expandedNodes = new Set();

        const children = this.transformedNodesGeneric.filter(
          (n) => n.parentId === node.id
        );
        this.displayedNodes = [...this.displayedNodes, ...children];
        this.expandedNodes.add(node.id);
        // EventBus.$emit("deselect-all", node.id);
        // EventBus.$emit("toggle-children", node.id);

        EventBus.$emit("table-node-click", node, 1);
      } else {
        // Node is not expanded, expand it
        if (!node.children || node.children.length == 0) {
          // EventBus.$emit("deselect-all", node.id);
          // EventBus.$emit("toggle-children", node.id);
          EventBus.$emit("table-node-click", node, 1);
        } else {
          const children = this.transformedNodesGeneric.filter(
            (n) => n.parentId === node.id
          );
          this.displayedNodes = [...this.displayedNodes, ...children];
          this.expandedNodes.add(node.id);
          // EventBus.$emit("deselect-all", node.id);
          // EventBus.$emit("toggle-children", node.id);
          EventBus.$emit("table-node-click", node, 1);
        }
      }
    }
    this.lastClickedNodeId = nodeId;
    this.createChart(this.displayedNodes, this.isVertical);
  }

  // Function to handle node click events from outside the component
  onNodeClickOut(nodeId: number) {
    // console.log("node by id", this.getNodeById(nodeId));

    const node = this.getNodeById(nodeId);

    if (!node) {
      console.error(`Node with ID ${nodeId} not found.`);
      return;
    }
    if (this.lastClickedNodeId !== null) {
      d3.select(`[data-node-id='${this.lastClickedNodeId}']`).classed(
        "node-shadow",
        false
      );
      // console.log(
      //   "Node clicked",
      //   node.id,
      //   "last clicked",
      //   this.lastClickedNodeId
      // );
    }
    this.lastClickedNodeId = node.id;
    d3.select(`[data-node-id='${node.id}']`).classed("node-shadow", true);
    this.scrollToNode(node.id);
    // console.log("Transformed data", this.transformedNodesGeneric, "Node", node);
    if (this.expandedNodes.has(node.id)) {
      // Node is already expanded, collapse it
      // this.displayedNodes = this.displayedNodes.filter(
      //   (n) => n.parentId !== node.id
      // );
      this.collapseNodeAndDescendants(node.id);
      this.expandedNodes.delete(node.id);
    } else {
      if (node.parentId !== null && !this.expandedNodes.has(node.parentId)) {
        this.displayedNodes = this.displayedNodes.filter(
          (n) => n.parentId !== node.id
        );
        this.expandedNodes.delete(node.id);
      } else if (node.parentId === null) {
        this.displayedNodes = this.getPrincipalNodes(
          this.transformedNodesGeneric
        );
        this.expandedNodes = new Set();

        // this.expandedNodes.add(node.id);
        const children = this.transformedNodesGeneric.filter(
          (n) => n.parentId === node.id
        );
        this.displayedNodes = [...this.displayedNodes, ...children];
        this.expandedNodes.add(node.id);
      } else {
        const children = this.transformedNodesGeneric.filter(
          (n) => n.parentId === node.id
        );
        this.displayedNodes = [...this.displayedNodes, ...children];
        this.expandedNodes.add(node.id);
      }
    }

    this.createChart(this.displayedNodes, this.isVertical);
  }

  // Function to scroll to a specific node in the SVG container
  scrollToNode(nodeId: number) {
    const svgContainer = document.querySelector(".svg-container");
    const nodeElement = d3.select(`[data-node-id='${nodeId}']`).node();

    if (!svgContainer || !nodeElement) {
      console.error("SVG container or node element not found.");
      return;
    }

    const containerRect = svgContainer.getBoundingClientRect();
    const nodeRect = nodeElement.getBoundingClientRect();

    const scrollTop =
      nodeRect.top + svgContainer.scrollTop - containerRect.top - 100; // Adjust 100 for padding
    const scrollLeft =
      nodeRect.left + svgContainer.scrollLeft - containerRect.left - 100; // Adjust 100 for padding

    svgContainer.scroll({
      top: scrollTop,
      left: scrollLeft,
      behavior: "smooth", // For smooth scrolling
    });
  }
  // Function to collapse a node and its descendants when another node is clicked
  collapseNodeAndDescendants(nodeId: number) {
    const children = this.transformedNodesGeneric.filter(
      (n) => n.parentId === nodeId
    );

    children.forEach((child) => {
      if (this.expandedNodes.has(child.id)) {
        this.collapseNodeAndDescendants(child.id);
      }
    });

    this.displayedNodes = this.displayedNodes.filter(
      (n) => n.parentId !== nodeId
    );
    this.expandedNodes.delete(nodeId);
  }
}

export { NodeVisualization };
export default NodeVisualization;
</script>


<style lang="scss">
.graph-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  // background: linear-gradient(to bottom right, #fff, #e3e1eb);

  // background-color: red;
  height: 100%;
  width: 100%;
  // overflow: auto;
}

.svg-container {
  width: 100%;
  height: 100%;
  display: flex;
  // overflow-y: scroll;
  background-color: #eff4f5;
  margin-top: 12px;
  // padding-top: 10px;
  overflow: auto !important;
}

::-webkit-scrollbar {
  height: 8px;
  /* height of horizontal scrollbar ← You're missing this */
  width: 8px;
  /* width of vertical scrollbar */
  // border: 1px solid #d5d5d5;
}

svg {
  flex-shrink: 0;
}

.tooltip {
  position: absolute;
  background-color: rgba(46, 45, 56, 1);
  border: 2px solid rgba(46, 45, 56, 1);
  border-radius: 5px;
  padding: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  font-size: 14px;
  z-index: 9999;
  /* Ensure it appears above other elements */
  color: white;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
}

.tooltip:before {
  content: "";
  width: 0px;
  height: 0px;
  position: absolute;
  border-left: 8px solid transparent;
  border-right: 8px solid rgba(46, 45, 56, 1);
  border-top: 8px solid rgba(46, 45, 56, 1);
  border-bottom: 8px solid transparent;
  left: -9px;
  top: -2px;
}

.tooltip p {
  margin-bottom: 3 !important;
  border-bottom: 0.3px solid #fff;
  line-height: 1.2;
  // padding-bottom: -10px;
}

.legend-container {
  // background-color: blue;
  // width: 250px;
  // height: 250px;
  display: flex;
  flex-direction: column;
  position: absolute;
  bottom: 15;
  right: 15;
}

/***********************title */
.chart-title-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 12px;
}

.toggle-container {
  position: relative;
  display: inline-block;
  width: 26px;
  height: 50px;
}

.toggle-switch {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-label {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  border-radius: 25px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.toggle-label:before {
  content: "";
  position: absolute;
  height: 22px;
  width: 22px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  border-radius: 50%;
  transition: transform 0.5s, rotate 0.5s;
  background-image: url('./assets/horizontal.svg');
  background-position: center;
  background-size: 50%;
  background-repeat: no-repeat;
}

.toggle-switch:checked+.toggle-label {
  background-color: rgba(46, 45, 56, 1);
}

.toggle-switch:checked+.toggle-label:before {
  transform: translateY(-25px) rotate(270deg);
}

// .fullscreen-chart-button{
//   background-image: url('./assets/horizontal.svg');
// }
.chart-buttons-button {
  width: 30px;
  height: 30px;
  background-color: white;
  border-radius: 6px;
  box-shadow: 0 6px 9px 0px rgba(0, 0, 0, 0.3);
  background-position: center;
  background-size: 50%;
  background-repeat: no-repeat;
}

.chart-buttons-button:hover {
  width: 34;
  height: 34;
}

.download-chart-button {
  background-image: url('./assets/download.svg');
  background-size: 60%;
}

.full-view-button {
  width: 20px;
  height: 20px;
  // background-image: url("./assets/fullscreen.svg");
  background-size: contain;
  background-repeat: no-repeat;
  cursor: pointer;
}

.chart-buttons {
  width: 40px;
  height: 145px;
  position: absolute;
  left: 15px;
  bottom: 15px;
  // padding-top: 5px;
  // padding-bottom: 5px;
  background-color: transparent;
  // box-shadow: 0 6px 9px 0px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  border-radius: 6px;
}

.chart-buttons-toggle {
  width: 30px;
  height: 52px;
  background-color: white;
  border-radius: 13px;
  box-shadow: 0 6px 9px 0px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.full-view-button:hover {
  width: 24px;
  height: 24px;
  left: 13px;
  bottom: 13px;
}

.full-screen {
  background-image: url("./assets/fullscreen.svg");
  background-size: 60%;
}

.half-screen {
  background-image: url("./assets/halfscreen.svg");
  background-size: 70%;
}

.show-all-icon {
  background-image: url("./assets/openall.svg");
  background-size: 70%;
}

.hide-all-icon {
  background-image: url("./assets/closeall.svg");
  background-size: 70%;
}

.show-all-button {
  cursor: pointer;
  width: 100px;
  height: 32px;
  padding: 5px 10px;
  border-radius: 5px;
  background-color: #14202c;
  text-align: center;
  color: white;
  font-size: 0.85rem;
  font-weight: bold;
  margin-right: 10px;
}

.show-all-button:hover {
  background-color: #14202c90;
}

.download-all-button {
  cursor: pointer;
  width: 32px;
  height: 32px;
  padding: 5px 10px;
  border-radius: 5px;
  background-color: #14202c;
  background-image: url("./assets/download.svg");
  background-size: 65%;
  background-repeat: no-repeat;
  background-position: center;
  margin-right: 10px;
}

.download-all-button:hover {
  background-color: #14202c90;
}
</style>
