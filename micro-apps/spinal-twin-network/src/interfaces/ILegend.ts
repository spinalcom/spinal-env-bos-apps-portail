import * as Factory from "factory.ts";
import { type IIdentifiable } from "./IIdentifiable";

type TypeLegend =
  | "Not-assigned"
  | "Assigned"
  | "AssignedToAnother"
  | "ToAssign"
  | "ToReAssign"
  | "ToDeAssign";

type Legend = {
  title: string;
  color: string;
  type: string;
} & IIdentifiable;

const iLegendFactory = Factory.Sync.makeFactory<Legend>({
  title: "Meaning",
  color: "black",
  id: Date.now(),
  type: "Not-assigned",
});

export { type Legend, iLegendFactory, type TypeLegend };
