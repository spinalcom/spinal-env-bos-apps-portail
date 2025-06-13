
# Workflow List
**Request** `/workflow/list`
**Response**
```json
[
  {
    "dynamicId": 74211712,
    "staticId": "SpinalContext-ef6c3e62-e409-af20-f919-8eaef7691f9e-187236d8b1d",
    "name": "Demande d'intervention",
    "type": "SpinalSystemServiceTicket"
  },
  {
    "dynamicId": 474573040,
    "staticId": "5ab0-b105-355a-190ea88533f",
    "name": "Tickets Otis",
    "type": "SpinalSystemServiceTicket"
  }
]
```

# Workflow Tree
**Request** `/workflow/${workflow.dynamicId}/tree`
**Response**
```json
{
  "dynamicId": 74211712,
  "staticId": "SpinalContext-ef6c3e62-e409-af20-f919-8eaef7691f9e-187236d8b1d",
  "name": "Demande d'intervention",
  "type": "SpinalSystemServiceTicket",
  "children": [
    {
      "dynamicId": 74209120,
      "staticId": "5bca-f47b-165a-187236e92ea",
      "name": "BATIMENT/SECOND ŒUVRE/CLOS COU",
      "type": "SpinalServiceTicketProcess",
      "color": "#ff00d0",
      "children": [{
          "dynamicId": 74206624,
          "staticId": "c8ae-a599-43cc-187236e92ed",
          "name": "Attente de lect.avant Execution",
          "type": "SpinalSystemServiceTicketTypeStep",
          "color": "#0804ef",
          "children": [
            {
              "dynamicId": 74203872,
              "staticId": "477b-b382-ecfb-1874d67e9e0",
              "name": "démo",
              "type": "SpinalSystemServiceTicketTypeTicket",
              "color": "#0066ff",
              "children": []
            },
            {
              "dynamicId": 180524128,
              "staticId": "7b34-875a-3244-1874dda3af6",
              "name": "Demande d'intervention",
              "type": "SpinalSystemServiceTicketTypeTicket",
              "color": "#cc00ff",
              "children": []
            },
            {
              "dynamicId": 180579072,
              "staticId": "a7cc-73fe-8670-1874dda4a9e",
              "name": "Demande d'intervention",
              "type": "SpinalSystemServiceTicketTypeTicket",
              "color": "#ff0098",
              "children": []
            }
          ]
        }
      ]
    }
  ]
}
```

**Logic**
Loop over the children of the object of type `SpinalServiceTicketProcess` and exclude closed, refused and archived types. Then take only the children of the other types.

# Reading details
**Request** `/ticket/${t.dynamicId}/read_details`
**Response** 
```json
{
  "dynamicId": 180579072,
  "staticId": "a7cc-73fe-8670-1874dda4a9e",
  "name": "Demande d'intervention",
  "type": "SpinalSystemServiceTicketTypeTicket",
  "priority": 2,
  "creationDate": 1680638364318,
  "description": "Demande",
  "declarer_id": "APPS",
  "elementSelected": {
    "dynamicId": 24061184,
    "staticId": "SpinalNode-6cd64ff8-a126-1aa3-80b7-f9d4fc5690bf-186df7cd2a5",
    "name": "RDC",
    "type": "geographicFloor"
  },
  "userName": "SPINAL Bos",
  "gmaoId": 185,
  "gmaoDateCreation": 1680638340000,
  "process": {
    "dynamicId": 74209120,
    "staticId": "5bca-f47b-165a-187236e92ea",
    "name": "BATIMENT/SECOND ŒUVRE/CLOS COU",
    "type": "SpinalServiceTicketProcess"
  },
  "step": {
    "dynamicId": 74206624,
    "staticId": "c8ae-a599-43cc-187236e92ed",
    "name": "Attente de lect.avant Execution",
    "type": "SpinalSystemServiceTicketTypeStep",
    "color": "#0804ef",
    "order": 0
  },
  "workflowId": 74211712,
  "workflowName": "Demande d'intervention",
  "annotation_list": [],
  "file_list": [],
  "log_list": [
    {
      "date": 1680638364320,
      "event": "created",
      "ticketStaticId": "a7cc-73fe-8670-1874dda4a9e"
    }
  ]
}
```

