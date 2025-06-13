# Project Architecture and Data Flow Report

## Overview
This document provides a comprehensive overview of the application’s architecture, structure, and data flow. It details the component hierarchy, core functionality, and interactions between different modules within the system.

## Project Structure
```
.
├── components
│   ├── color-selector
│   │   ├── ColorMenu.vue
│   │   └── ColorSelector.vue
│   ├── date-fields
│   │   ├── DateFieldSelector.vue
│   │   └── DateField.vue
│   ├── date-fields-combined
│   │   ├── DateFieldSelector.vue
│   │   ├── DateFieldsSelector.vue
│   │   └── DateField.vue
│   ├── details
│   │   ├── Chip.vue
│   │   ├── Description.vue
│   │   ├── EditDetails.vue
│   │   └── LogStep.vue
│   └── ui
│       ├── Menu.vue
│       └── StepSelector.vue
├── day
│   ├── CalendarContent.vue
│   ├── GroupPeriod.vue
│   ├── Main.vue
│   ├── SideBar.vue
│   ├── Status.vue
│   ├── TaskDetails.vue
│   ├── TaskPeriod.vue
│   ├── Task.vue
│   └── TodayMarker.vue
├── Main.vue
└── SpaceSelector
    ├── convertZonesToISpaceSelectorItems.ts
    ├── index.ts
    ├── interfaces
    │   ├── IBuildingItem.ts
    │   └── ISpaceSelectorItem.ts
    ├── SpaceSelector copy.vue
    ├── SpaceSelectorItem.vue
    └── SpaceSelector.vue

10 directories, 30 files
```

## Application Flow
### Entry Point: `Main.vue`
The application starts at `Main.vue`, which serves as the root component. It initializes the three-row top bar and sets up the primary layout.

### Top Bar
- **Row 1**: Provides essential actions such as zooming, sliding left and right.
- **Row 2 & 3**: Control various functionalities within the Gantt chart interface.

### Calendar Content
- The `CalendarContent.vue` component serves as the main container for the Gantt chart and other related elements.

### Sidebar (`SideBar.vue`)
- The left sidebar is structured into three levels:
  1. **Workflows**: High-level categories of processes.
  2. **Processes**: Expandable lists containing workflows.
  3. **Tickets**: The lowest level, showing individual tickets within processes.
- The sidebar is resizable to enhance user flexibility.

### Main Content Area
- On the right side, a large `div` serves as the primary workspace.
- Inside this div, a list of tasks is displayed.
- Each task:
  - Spans the full width and maintains a height of `30px`.
  - Contains a `TaskPeriod.vue` component that visually represents the task duration.
  - Uses a 30px-per-day scale to depict task timelines.
  - Clicking a period opens the task’s detailed information (`TaskDetails.vue`).

## Component Breakdown
### Task Components
- **`Task.vue`**: Represents an individual task in the Gantt chart.
- **`TaskPeriod.vue`**: Highlights the duration of a ticket.
- **`TaskDetails.vue`**: Displays ticket details upon selection.

### UI Components
- **`Menu.vue`**: Provides dropdown and navigation functionalities.
- **`StepSelector.vue`**: Allows users to choose different workflow steps.

### Date Handling
- **`DateField.vue` & `DateFieldSelector.vue`**: Handle date selection logic.
- **`DateFieldsSelector.vue`**: Manages combined date fields within workflows.

### Space Selection
- **`SpaceSelector.vue`**: Allows users to pick and manage different workspace zones.
- **Utility Files**: `convertZonesToISpaceSelectorItems.ts` provides helper functions for data conversion.

## Data Flow
1. **User Interaction**
   - Users interact with the Gantt chart via zoom, slide, and selection actions.
   - Clicking a task triggers an event that opens its details.
   
2. **State Management**
   - The application leverages component-based state management for real-time updates.
   
3. **Rendering and Updates**
   - Changes to task durations or statuses trigger component re-renders.
   - Sidebar interactions modify the displayed processes and tickets dynamically.

## Conclusion
This document serves as a detailed reference for the application’s architecture, helping future developers understand its structure, functionality, and data flow. For further improvements, optimizations in state management and UI performance can be explored.

# Services Architecture Overview

## Introduction
This document describes the architecture and functionality of the service files in the project. It provides an overview of their structure, responsibilities, and interactions.

## File Structure
The key service files include:
- `dates.js`
- `index.js`
- `locate.js`

## Services Breakdown

### 1. `dates.js`
This module is responsible for handling ticket-related date attributes, such as estimated start and end dates.

#### **Key Functions**
- **`getAttributes(bid, ticketList)`**: Fetches attributes for a list of tickets by making batched API calls.
- **`mapDates(ticketList, attributeList)`**: Maps the retrieved attributes to ticket objects, extracting `estimatedStartDate` and `estimatedEndDate`.
- **`getCategoryId(bid, tid, categoryName = 'default')`**: Retrieves the category ID of a ticket.
- **`setEstimatedStart(tid, date)`**: Sets the estimated start date of a ticket.
- **`setEstimatedEnd(tid, date)`**: Sets the estimated end date of a ticket.
- **`createAttribute(tid, attribute)`**: Creates or updates an attribute for a given ticket.
- **`setStartEndLimits(nestedList, selected)`**: Updates start and end limits for workflows and processes based on ticket dates.

#### **Purpose**
This module provides a structured approach to managing date attributes associated with tickets, ensuring consistency in fetching, storing, and updating values.

---
### 2. `index.js`
This module acts as an aggregator, managing workflows, processes, steps, and tickets.

#### **Key Functions**
- **`getAll()`**: Fetches all workflows, processes, steps, and tickets, organizing them into a hierarchical structure.
- **`removeProcessWithNoTickets(workflowList)`**: Filters out processes that do not contain any tickets.

#### **Purpose**
This module is the entry point for retrieving and structuring ticket-related entities into a well-defined hierarchy.

---
### 3. `locate.js`
This module is responsible for determining the geographic location of tickets based on associated equipment or architectural elements.

#### **Key Functions**
- **`ticket(ticketList)`**: Processes tickets and assigns locations by grouping them by type.
- **`getBuildingPosition(group)`**: Assigns building IDs to tickets categorized as `geographicBuilding`.
- **`getFloorPosition(group)`**: Retrieves and assigns floor IDs to tickets categorized as `geographicFloor`.
- **`getRoomPosition(group)`**: Retrieves and assigns room details for tickets categorized as `geographicRoom`.
- **`getEquipmentPosition(group)`**: Retrieves and assigns locations for equipment-based tickets (`BIMObject`).
- **`prepareTickets(group)`**: Flattens grouped ticket data into a single array.

#### **Purpose**
This module ensures that each ticket is assigned a precise location within the building, aiding in spatial tracking and management.

---
## Conclusion
These service files provide essential functionality for managing workflows, ticket attributes, and spatial location data. They interact with API endpoints to retrieve and update information, ensuring a well-structured and efficient data-handling process.

# Workflow Modules Documentation

## Overview
This documentation covers several JavaScript modules used to handle workflows, processes, steps, tickets, and utilities for a building management system.

## Modules

### 1. `process.js`
#### Purpose
Handles retrieving workflow processes for a given building ID (`bid`).

#### Functions
- `processWorkflowProcesses(bid, workflow)`: Fetches processes related to a specific workflow.
- `getProcesses(bid, workflowList)`: Aggregates processes for all workflows in the given list.

#### Usage
```js
import processes from './process.js';
const processess = await processes.getProcesses(buildingId, workflowList);
```

---

### 2. `step.js`
#### Purpose
Manages steps associated with processes within a workflow.

#### Functions
- `processProcessesSteps(bid, process)`: Fetches steps for a specific process.
- `getSteps(bid, processList)`: Retrieves all steps for a given list of processess.
- `getStepsByProcess(workflowId, processId)`: Fetches steps for a single process using workflow and process IDs.

#### Usage
```js
import step from './step.js';
const steps = await step.getSteps(buildingId, processList);
```

---

### 3. `ticket.js`
#### Purpose
Handles ticket retrieval and processing, including constructing ticket objects and managing date attributes.

#### Functions
- `getTickets(bid, stepList)`: Retrieves tickets for multiple steps.
- `getMultipleTickets(bid, stepList)`: Fetches tickets in chunks for optimized performance.
- `constructTickets(ticketList, stepList)`: Formats ticket data into structured objects.
- `getEndDate(bid, constructed)`: Determines real end dates for tickets based on log data.
- `getRealDates(dates)`: Extracts actual start and end dates based on configured workflow steps.
- `addDates(ticket, logs)`: Merges log data into ticket date attributes.
- `getEndSteps()`: Retrieves workflow steps that indicate completion.

#### Usage
```js
import ticket from './ticket.js';
const tickets = await ticket.getTickets(buildingId, stepList);
```

---

### 4. `utils.js`
#### Purpose
Provides utility functions for array manipulation.

#### Functions
- `chunkArray(array, size)`: Splits an array into chunks of a given size.

#### Usage
```js
import { chunkArray } from './utils.js';
const chunks = chunkArray(bigArray, 50);
```

---

### 5. `workflow.js`
#### Purpose
Handles workflow retrieval for a given building.

#### Functions
- `list(bid)`: Retrieves a list of workflows for the specified building.

#### Usage
```js
import workflow from './workflow.js';
const workflows = await workflow.list(buildingId);
```

---

## Dependencies
- `HTTP` (imported from `http-constants.js`) for API requests.
- `config.js` for workflow configuration.
- `dates.js` for date attribute management.
- `locate.js` for ticket location processing.

## Notes
- API calls are assumed to return data in a predefined structure.
- Some functions assume the presence of `localStorage` for retrieving building IDs.
- Error handling is included but can be expanded as needed.


# Things to do
- [ ] Bulk move & resize - Control Parent to Adjust All Children
- [ ] Filtering
- [ ] Add an icon in the top left corner to setup the workflows
- [ ] How to handle tickets that are not closed yet
- [ ] Add a glass effect for delayed tickets
- [ ] Color labels - like what does each color mean
- [ ] Replace default category with configurable categories in config.js
- [ ] Sort, by date - by field
- [ ] Highlight delayed tickets
- [ ] Show budgets when you highligh a period


# App screens
![Screenshot from 2025-02-25 10-14-40](https://github.com/user-attachments/assets/0a519d80-b333-47fd-9ab3-e085222f0bf7)
![Screenshot from 2025-02-25 10-15-22](https://github.com/user-attachments/assets/daf41ddf-7353-42e0-98a6-3d4e1b38d835)
![Screenshot from 2025-02-25 10-23-25](https://github.com/user-attachments/assets/72947b77-c7f5-4cba-8275-4d5223371e40)

