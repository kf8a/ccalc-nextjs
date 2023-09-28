"use client";
import { useCallback } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Button,
  Tooltip,
} from "@nextui-org/react";
import { PressEvent } from "@react-types/shared";
import { CropSelect, TillageSelect, RotationInput } from "./select_boxes";
import {
  scenario_info,
  unit_system_type,
  County,
  rotation_info,
} from "@/lib/model";
import StyledTooltip from "./styled_tooltip";
import { TrashIcon } from "@heroicons/react/24/outline";

const table_columns = [
  { key: "year", label: "Year" },
  { key: "crop_name", label: "Crop" },
  { key: "crop_yield", label: "Crop Yield" },
  { key: "tillage", label: "Tillage" },
  { key: "nitrogen", label: "Fertilizer" },
];

const tillage = ["conventional", "reduced", "no-till"];

export default function RotationTable(props: {
  scenario: scenario_info;
  crop_name_updater: any;
  crop_yield_updater: any;
  tillage_updater: any;
  nitrogen_updater: any;
  unit_system: unit_system_type;
  add_rotation: any;
  delete_rotation: any;
  ok_to_delete: boolean;
}) {
  const rows = props.scenario.rotations;

  function addRotation(e: PressEvent) {
    props.add_rotation(props.scenario.id);
  }

  function add_tooltip(name: string, content: string) {
    return (
      <Tooltip className="w-80" content={content}>
        <span>{name}</span>
      </Tooltip>
    );
  }

  function getCropName(item: rotation_info) {
    return item.crop_name;
  }

  function getTillage(item: rotation_info) {
    return item.tillage;
  }

  function getNitrogen(item: rotation_info) {
    return item.nitrogen;
  }

  function getCropYield(item: rotation_info) {
    return item.crop_yield;
  }

  const renderCell = useCallback(
    (item: rotation_info, columnKey: string, index: number) => {
      switch (columnKey) {
        case "crop_name":
          return (
            <CropSelect
              value={getCropName(item)}
              rotation={index}
              updater={props.crop_name_updater}
            />
          );
        case "tillage":
          return (
            <TillageSelect
              value={getTillage(item)}
              rotation={index}
              updater={props.tillage_updater}
            />
          );
        case "crop_yield":
          return (
            <RotationInput
              value={getCropYield(item).toString()}
              rotation={index}
              unit_system={props.unit_system}
              updater={props.crop_yield_updater}
            />
          );
        case "nitrogen":
          return (
            <RotationInput
              value={getNitrogen(item).toString()}
              rotation={index}
              unit_system={props.unit_system}
              updater={props.nitrogen_updater}
            />
          );
        default:
          return item.year;
      }
    },
    []
  );

  function crop_yield_units(unit_system: unit_system_type, crop_name: string) {
    switch (unit_system) {
      case "imperial":
        switch (crop_name) {
          case "corn":
          case "soybean":
          case "wheat":
            return "bu/ac";

          default:
            return "t/ac";
        }
      case "metric":
        return "Mg/ha";
    }
  }
  // const crop_yield_units = props.unit_system === "imperial" ? "bu/ac" : "Mg/ha";
  const fertilizer_units = props.unit_system === "imperial" ? "lb/ac" : "kg/ha";

  return (
    <div className="">
      <h4 className="text-lg">{`${props.scenario.title} (Crop Rotation)`}</h4>
      <Table aria-label="rotations table">
        <TableHeader>
          <TableColumn>Year</TableColumn>
          <TableColumn>
            <StyledTooltip
              label="Crop"
              info="Each crop in a rotation affects greenhouse gas emissions differently. Different crops add back to the soil different kinds and amounts of residues, which can help to build soil carbon stores. Different crops also have different fertilizer needs, and can require different amounts of fuel to grow."
            />
          </TableColumn>
          <TableColumn className="w-36">
            <StyledTooltip
              label="Yield"
              info="Crop yields are used to calculate the residue that remains in the field to become soil organic matter. Higher yields mean more roots and aboveground residues to become soil carbon."
            />
          </TableColumn>
          <TableColumn> </TableColumn>
          <TableColumn>
            <StyledTooltip
              label="Tillage"
              info="In Conventional Tillage the soil is plowed to mix the previous year's crop residue into the soil and to kill weeds. In reduced tillage, soil is plowed more selectively, for example only in the strip where seeds are to be planted. In no-till, the soil is undisturbed except for a small slit into which seeds are planted. Tillage destroys soil aggregates and stimulates microbes to convert soil organic carbon to CO2. Tilled soils also drain more poorly than no-till soils."
            />
          </TableColumn>
          <TableColumn className="w-36">
            <StyledTooltip
              label={`Fertilizer ${fertilizer_units}`}
              info="The amount of fertilizer nitrogen applied to a crop affects the amount of nitrogen available for crop growth and for conversion to the greenhouse gas nitrous oxide."
            />
          </TableColumn>
          <TableColumn> </TableColumn>
        </TableHeader>
        <TableBody>
          {rows.map((item) => (
            <TableRow key={`${props.scenario.id}_${item.id}`}>
              <TableCell>{renderCell(item, "year", item.year)}</TableCell>
              <TableCell>{renderCell(item, "crop_name", item.year)}</TableCell>
              <TableCell>{renderCell(item, "crop_yield", item.year)}</TableCell>
              <TableCell>
                {crop_yield_units(props.unit_system, item.crop_name)}
              </TableCell>
              <TableCell>{renderCell(item, "tillage", item.year)}</TableCell>
              <TableCell>{renderCell(item, "nitrogen", item.year)}</TableCell>
              <TableCell>
                {props.scenario.rotations.length > 1 || props.ok_to_delete ? (
                  <Button
                    onClick={(e) => props.delete_rotation(item.id, e)}
                    color="danger"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                ) : (
                  " "
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button className="m-3" color="primary" onPress={addRotation}>
        Extend the Rotation
      </Button>
    </div>
  );
}
